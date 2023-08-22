import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec, execSync } from 'child_process';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { StackDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { LogGatewayService } from 'src/logGateway/logGateway.service';
import {
  logError,
  getTerraformFiles,
  updateVars,
  mapInstance,
  deleteTerraformDir,
  saveLogsToCSV,
  uploadToS3,
  deleteCSV,
  codeGen,
} from './helpers';
import { Deployments, User } from '@prisma/client';
import { SESService } from 'src/ses/ses.service';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { DeleteSecretDto } from 'src/secretManager/dto';

@Injectable()
export class InfraService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private logsGateway: LogGatewayService,
    private sesService: SESService,
    private secretManagerService: SecretManagerService,
  ) {}

  bucketName = this.config.get('BUCKET_NAME');
  prefix = this.config.get('S3_PREFIX');
  errorBucketName = this.config.get('ERROR_BUCKET_NAME');
  bucketsRegion = this.config.get('BUCKET_REGION');
  mainTfFile = this.config.get('MAIN_TF_FILE');
  logsFileName = 'logs.txt';
  destroyLogsFileName = 'destroy-logs.txt';

  async initialize(req: Request, res: Response, infraInitDto: StackDto) {
    let deploymentInfo;
    const user: User = req.user as User;
    const id = uuidv4();
    try {
      // Creating an entry in the database
      deleteTerraformDir(user.id, id);

      await getTerraformFiles(
        this.bucketName,
        this.prefix,
        this.bucketsRegion,
        user.id,
        id,
      );

      saveLogsToCSV(
        '\nDeleted Previous TF Files',
        user.id.concat(this.logsFileName),
      );

      const instanceSize = mapInstance(infraInitDto.instance);
      deploymentInfo = await this.prisma.deployments.create({
        data: {
          id: id,
          name: infraInitDto.name,
          progress: infraInitDto.progress,
          userId: req.user['id'],
          az: infraInitDto.az,
          instance: instanceSize,
          region: infraInitDto.region,
          cloud: infraInitDto.cloud,
          services: infraInitDto.services,
        },
      });

      if (!deploymentInfo) {
        throw Error('Failed to create deployment.');
      }

      saveLogsToCSV(
        '\nCreated deployment record in the DB',
        user.id.concat(this.logsFileName),
      );
      // Removing unique key from main.tf to add s3 path

      saveLogsToCSV(
        '\nDownloaded TF Files from S3 and stored in /terraform.',
        user.id.concat(this.logsFileName),
      );

      execSync(
        `sed -i 's/backendUniqueKeyPath/state\\/${user.id}\\/${deploymentInfo.id}\\/terraform.tfstate/g' ${this.mainTfFile}`,
        {
          cwd: process
            .cwd()
            .concat(`/terraform/${user.id}/${deploymentInfo.id}/`),
        },
      );

      saveLogsToCSV(
        `\nUpdated ${this.mainTfFile} with the appropriate backend key.`,
        user.id.concat(this.logsFileName),
      );

      // Checking if the secret already exists or not
      const secretDetail = await this.secretManagerService.getSecret({
        secretName: 'stack_' + user.id.concat('_' + deploymentInfo.id),
        region: deploymentInfo.region,
      });

      if (!secretDetail.exists) {
        await this.secretManagerService.createSecret({
          secretName: 'stack_' + user.id.concat('_' + deploymentInfo.id),
          region: user.secretManagerRegion
            ? user.secretManagerRegion
            : deploymentInfo.region,
        });

        if (!user.secretManagerRegion) {
          await this.prisma.user.update({
            where: { id: user.id },
            data: { secretManagerRegion: deploymentInfo.region },
          });
        }
      }

      //  Terraform init command
      saveLogsToCSV(
        '\nStarted init process.',
        user.id.concat(this.logsFileName),
      );

      exec(
        'terraform init --reconfigure',
        {
          cwd: process
            .cwd()
            .concat(`/terraform/${user.id}/${deploymentInfo.id}/`),
        },
        async (error, stdout, stderr) => {
          // Will trigger error handling flow on error
          if (error) {
            await this.handleError({
              error: error,
              stackInfo: deploymentInfo,
              user: user,
            });
            await uploadToS3({
              userId: user.id,
              deploymentId: deploymentInfo.id,
              bucketRegion: this.bucketsRegion,
              errorBucketName: this.errorBucketName,
              fileName: user.id.concat(this.logsFileName),
            });
            deleteCSV(user.id.concat(this.logsFileName));
            return;
          }

          if (stderr) {
            console.log('stderr:' + stderr);
            return;
          }

          console.log('stdout:' + stdout);
          saveLogsToCSV(
            `\n${stdout.toString()}`,
            user.id.concat(this.logsFileName),
          );
          saveLogsToCSV(
            '\nInit process Successful.',
            user.id.concat(this.logsFileName),
          );

          // Setting deployment status to provisioning on successful initializing
          deploymentInfo.progress = 'provisioning';

          // Updating status on front-end
          this.logsGateway.handleEvent('progress', {
            id: deploymentInfo.id,
            progress: deploymentInfo.progress,
          });

          // Updating status in the db as well
          const updatedDeploymentInfo = await this.prisma.deployments.update({
            where: { id: deploymentInfo.id },
            data: {
              progress: deploymentInfo.progress,
            },
          });

          saveLogsToCSV(
            '\nChanged status of deployment to provisioning.',
            user.id.concat(this.logsFileName),
          );

          await this.deploy(req, res, updatedDeploymentInfo);
        },
      );
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      await this.handleError({
        error: error,
        stackInfo: deploymentInfo,
        user: req.user as User,
      });
      await uploadToS3({
        userId: user.id,
        deploymentId: deploymentInfo.id,
        bucketRegion: this.bucketsRegion,
        errorBucketName: this.errorBucketName,
        fileName: user.id.concat(this.logsFileName),
      });
      deleteCSV(user.id.concat(this.logsFileName));
      throw new InternalServerErrorException(error.message);
    }
  }

  async deploy(req: Request, res: Response, deploymentDto: Deployments) {
    // Getting AMI as per the region

    const user: User = req.user as User;

    try {
      // Updating Terraform Vars
      saveLogsToCSV(
        '\nStarted deployment of stack.',
        user.id.concat(this.logsFileName),
      );

      updateVars(deploymentDto, user);

      saveLogsToCSV(
        '\nUpdated terraform.tfvars.json with variables.',
        user.id.concat(this.logsFileName),
      );
      // Calling the terraform apply command with vars

      saveLogsToCSV(
        '\nExecuting the terraform apply command.',
        user.id.concat(this.logsFileName),
      );
      exec(
        `\nterraform apply -auto-approve -lock=false`,
        {
          cwd: process
            .cwd()
            .concat(`/terraform/${user.id}/${deploymentDto.id}/`),
        },

        async (error, stdout, stderr) => {
          // Will trigger error handling flow on Error
          if (error) {
            await this.handleError({
              error: error,
              stackInfo: deploymentDto,
              user: user,
            });
            await uploadToS3({
              userId: user.id,
              deploymentId: deploymentDto.id,
              bucketRegion: this.bucketsRegion,
              errorBucketName: this.errorBucketName,
              fileName: user.id.concat(this.logsFileName),
            });
            deleteCSV(user.id.concat(this.logsFileName));
            this.destroy(req, res, deploymentDto.id, false);
            return;
          }
          if (stderr) {
            console.log('stderr:' + stderr);
            return;
          }

          console.log('stdout:' + stdout);
          saveLogsToCSV(
            `\n${stdout.toString()}`,
            user.id.concat(this.logsFileName),
          );
          saveLogsToCSV(
            '\nTerraform apply completed.',
            user.id.concat(this.logsFileName),
          );

          // Updating status at the front-end
          this.logsGateway.handleEvent('progress', {
            id: deploymentDto.id,
            progress: 'success',
          });

          // Updating status in DB
          await this.prisma.deployments.update({
            where: { id: deploymentDto.id },
            data: {
              progress: 'success',
            },
          });

          const outputString = execSync(`terraform output -json`, {
            cwd: process
              .cwd()
              .concat(`/terraform/${user.id}/${deploymentDto.id}/`),
          });

          const parsedOutput = JSON.parse(outputString.toString());

          const secretValues = {
            fw1_ip: parsedOutput['fw1-ip'].value,
            fw1_api: parsedOutput['fw1-api'].value,
            log_ip: parsedOutput['log-ip'].value,
            log_api: parsedOutput['log-api'].value,
          };

          const dbValues = {
            twgId: parsedOutput['tgw-id'].value,
            twgArn: parsedOutput['tgw-arn'].value,
            securenatgwHubTgwRtb: parsedOutput['securenatgw-hub-tgw-rtb'].value,
            securenatgwSpokeTgwRtb:
              parsedOutput['securenatgw-spoke_tgw-rtb'].value,
          };

          await this.secretManagerService.updateSecret({
            region: user.secretManagerRegion,
            secretName: 'stack_' + user.id.concat('_' + deploymentDto.id),
            secretString: JSON.stringify(secretValues),
          });

          await this.prisma.deployments.update({
            where: {
              id: deploymentDto.id,
            },
            data: {
              ...dbValues,
            },
          });

          saveLogsToCSV(
            '\nChanging status of deployment to success',
            user.id.concat(this.logsFileName),
          );

          execSync(
            `sed -i 's/state\\/${req.user['id']}\\/${
              deploymentDto.id
            }\\/terraform.tfstate/backendUniqueKeyPath/g' ${this.config.get(
              'MAIN_TF_FILE',
            )}`,
            {
              cwd: process
                .cwd()
                .concat(`/terraform/${user.id}/${deploymentDto.id}/`),
            },
          );
          // Uploading logs and deleting files.
          await uploadToS3({
            userId: user.id,
            deploymentId: deploymentDto.id,
            bucketRegion: this.bucketsRegion,
            errorBucketName: this.errorBucketName,
            fileName: user.id.concat(this.logsFileName),
          });
          deleteCSV(user.id.concat(this.logsFileName));
        },
      );

      return res.status(HttpStatus.OK).send();
    } catch (error) {
      await this.handleError({
        error: error,
        stackInfo: deploymentDto,
        user: req.user as User,
      });
      await uploadToS3({
        userId: user.id,
        deploymentId: deploymentDto.id,
        bucketRegion: this.bucketsRegion,
        errorBucketName: this.errorBucketName,
        fileName: user.id.concat(this.logsFileName),
      });
      deleteCSV(user.id.concat(this.logsFileName));
      throw new InternalServerErrorException(error.message);
    }
  }

  async destroy(req: Request, res: Response, id: string, getFiles = true) {
    let deploymentInfo;
    const user: User = req.user as User;

    try {
      const stackConnector = await this.prisma.stackConnector.findFirst({
        where: {
          deploymentId: id,
          status: 'connected',
        },
        include: {
          connector: {
            select: {
              accountId: true,
            },
          },
        },
      });

      if (stackConnector) {
        return res.status(HttpStatus.OK).send({
          status: 400,
          message:
            'Deployment is associated with Account #' +
            stackConnector.connector.accountId,
        });
      }

      saveLogsToCSV(
        '\nStarting destroy process.',
        user.id.concat(this.destroyLogsFileName),
      );

      if (getFiles) {
        deleteTerraformDir(user.id, id);

        saveLogsToCSV(
          '\nDeleted previous TF Files.',
          user.id.concat(this.destroyLogsFileName),
        );

        await getTerraformFiles(
          this.bucketName,
          this.prefix,
          this.bucketsRegion,
          user.id,
          id,
        );

        saveLogsToCSV(
          '\nDownloading Terraform Files from S3 and storing in /terraform.',
          user.id.concat(this.destroyLogsFileName),
        );

        execSync(
          `sed -i 's/backendUniqueKeyPath/state\\/${
            req.user['id']
          }\\/${id}\\/terraform.tfstate/g' ${this.config.get('MAIN_TF_FILE')}`,
          {
            cwd: process.cwd().concat(`/terraform/${user.id}/${id}/`),
          },
        );

        saveLogsToCSV(
          `\nSetting s3 backend key path in ${this.mainTfFile}.`,
          user.id.concat(this.destroyLogsFileName),
        );
      }

      deploymentInfo = await this.prisma.deployments.findUnique({
        where: {
          id: id,
        },
      });

      if (!deploymentInfo) {
        throw Error('Failed to get deployment info');
      }

      // Updating terraform.tfvars.json
      updateVars(deploymentInfo, user);
      //  Terraform init command

      saveLogsToCSV(
        `\nUpdated variables in terraform.tfvars.json`,
        user.id.concat(this.destroyLogsFileName),
      );

      // Changing status to destroying
      await this.prisma.deployments.update({
        where: {
          id: deploymentInfo.id,
        },
        data: {
          progress: 'destroying',
        },
      });

      saveLogsToCSV(
        `\nExecuting terraform init commands for destroy.`,
        user.id.concat(this.destroyLogsFileName),
      );

      exec(
        'terraform init --reconfigure',
        {
          cwd: process.cwd().concat(`/terraform/${user.id}/${id}/`),
        },
        async (error, stdout, stderr) => {
          console.log(stdout);
          saveLogsToCSV(
            `\n terraform init command successful.`,
            user.id.concat(this.destroyLogsFileName),
          );

          saveLogsToCSV(
            `\nExecuting terraform destroy command.`,
            user.id.concat(this.destroyLogsFileName),
          );

          exec(
            `terraform destroy -auto-approve -lock=false`,
            {
              cwd: process
                .cwd()
                .concat(`/terraform/${user.id}/${deploymentInfo.id}/`),
            },

            async (error, stdout, stderr) => {
              // Triggering the error handling flow
              if (error) {
                await this.handleError({
                  error: error,
                  stackInfo: deploymentInfo,
                  user: user,
                });
                await uploadToS3({
                  userId: user.id,
                  deploymentId: deploymentInfo.id,
                  bucketRegion: this.bucketsRegion,
                  errorBucketName: this.errorBucketName,
                  fileName: user.id.concat(this.destroyLogsFileName),
                });
                deleteCSV(user.id.concat(this.destroyLogsFileName));
                return;
              }
              if (stderr) {
                console.log('stderr:' + stderr);
                return;
              }
              console.log('stdout:' + stdout);
              saveLogsToCSV(
                `\n${stdout.toString()}`,
                user.id.concat(this.destroyLogsFileName),
              );

              saveLogsToCSV(
                `\n terraform destroy command successfully executed.`,
                user.id.concat(this.destroyLogsFileName),
              );
              // Updating status at the front-end
              this.logsGateway.handleEvent('progress', {
                id: id,
                progress: 'destroyed',
              });

              // Updating status in db
              await this.prisma.deployments.update({
                where: { id: id },
                data: {
                  progress: 'destroyed',
                },
              });

              saveLogsToCSV(
                `\n Updated the deployment status to destroyed.`,
                user.id.concat(this.destroyLogsFileName),
              );

              await this.secretManagerService.deleteSecret({
                region: user.secretManagerRegion,
                secretName: 'stack_' + user.id.concat('_' + deploymentInfo.id),
              });

              execSync(
                `sed -i 's/state\\/${
                  req.user['id']
                }\\/${id}\\/terraform.tfstate/backendUniqueKeyPath/g' ${this.config.get(
                  'MAIN_TF_FILE',
                )}`,
                {
                  cwd: process
                    .cwd()
                    .concat(`/terraform/${user.id}/${deploymentInfo.id}/`),
                },
              );
              // Uploading logs and deleting files
              await uploadToS3({
                userId: user.id,
                deploymentId: deploymentInfo.id,
                bucketRegion: this.bucketsRegion,
                errorBucketName: this.errorBucketName,
                fileName: user.id.concat(this.destroyLogsFileName),
              });
              deleteCSV(user.id.concat(this.destroyLogsFileName));
              deleteTerraformDir(user.id, deploymentInfo.id);
            },
          );
        },
      );
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      await this.handleError({
        error: error,
        stackInfo: deploymentInfo,
        user: req.user as User,
      });
      await uploadToS3({
        userId: user.id,
        deploymentId: deploymentInfo.id,
        bucketRegion: this.bucketsRegion,
        errorBucketName: this.errorBucketName,
        fileName: user.id.concat(this.destroyLogsFileName),
      });
      deleteCSV(user.id.concat(this.destroyLogsFileName));
      throw new InternalServerErrorException(error.message);
    }
  }

  async handleError({
    error,
    stackInfo,
    user,
  }: {
    error: Error;
    stackInfo: Deployments;
    user: User;
  }) {
    console.log(error);
    // Updating status at the front-end
    this.logsGateway.handleEvent('error', error);
    this.logsGateway.handleEvent('progress', {
      id: stackInfo.id,
      progress: 'error',
    });

    await this.prisma.deployments.update({
      where: { id: stackInfo.id },
      data: {
        progress: 'error',
      },
    });

    // Logging Error to the error-log.csv
    await logError({
      userId: user.id,
      error: error.message.toString(),
      deploymentId: stackInfo.id,
      progress: stackInfo.progress,
      errorBucketName: this.errorBucketName,
      bucketRegion: this.bucketsRegion,
    });
  }

  async sendTwoFaEmail(req: Request, res: Response) {
    try {
      const code = codeGen();
      await this.sesService.sendEmail({
        subject: 'Verification Code',
        body: `Please use the following code to deploy your stack.\n\n ${code}`,
      });

      return res.send(Buffer.from(code.toString()).toString('base64'));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
