import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import {
  StackConnectorDtoAdd,
  StackConnectorDtoSubnet,
  StackConnectorDtoVPC,
} from './dto';
import { Request } from 'express';
import { CloudFormation, EC2, Lambda, RAM } from 'aws-sdk';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { LogGatewayService } from 'src/logGateway/logGateway.service';

@Injectable()
export class StackConnectorService {
  constructor(
    private secretManager: SecretManagerService,
    private prisma: PrismaService,
    private config: ConfigService,
    private logsGateway: LogGatewayService,
  ) {}

  async getStackConnectors(req: Request) {
    const user: User = req.user as User;

    return this.prisma.stackConnector.findMany({
      where: { userId: user.id, status: { in: ['connecting', 'connected'] } },
      include: {
        connector: {
          select: {
            name: true,
            cloud: true,
          },
        },
        deployment: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getVPC(dto: StackConnectorDtoVPC, req: Request) {
    const user: User = req.user as User;

    const secretObj = await this.secretManager.getSecret({
      region: user.secretManagerRegion,
      secretName: 'connector_' + user.id.concat('_' + dto.connectorId),
    });

    if (!secretObj.exists) {
      throw new NotFoundException('Secret Not Found');
    }

    const { AWS_API_KEY, AWS_SECRET_KEY } = JSON.parse(
      secretObj.secretDetails.SecretString,
    );

    const client = new EC2({
      region: dto.region,
      credentials: {
        accessKeyId: AWS_API_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
    });

    return client.describeVpcs().promise();
  }

  async getSubnets(dto: StackConnectorDtoSubnet, req: Request) {
    const user: User = req.user as User;

    const secretObj = await this.secretManager.getSecret({
      region: user.secretManagerRegion,
      secretName: 'connector_' + user.id.concat('_' + dto.connectorId),
    });

    if (!secretObj.exists) {
      throw new NotFoundException('Secret not found.');
    }

    const { AWS_API_KEY, AWS_SECRET_KEY } = JSON.parse(
      secretObj.secretDetails.SecretString,
    );

    const client = new EC2({
      region: dto.region,
      credentials: {
        accessKeyId: AWS_API_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
    });
    const input = {
      Filters: [
        {
          Name: 'vpc-id',
          Values: [dto.vpcs],
        },
      ],
    };

    return client.describeSubnets(input).promise();
  }

  async addStackConnector(dto: StackConnectorDtoAdd, req: Request) {
    try {
      const id = uuidv4();
      const user: User = req.user as User;
      const secretDeploymentInformation = await this.secretManager.getSecret({
        region: user.secretManagerRegion,
        secretName: 'stack_' + user.id.concat('_' + dto.deploymentId),
      });

      if (!secretDeploymentInformation.exists)
        throw new BadRequestException('No Secret Found');

      const parsedSecret = JSON.parse(
        secretDeploymentInformation.secretDetails.SecretString,
      );

      const deploymentInformation = await this.prisma.deployments.findUnique({
        where: {
          id: dto.deploymentId,
        },
      });

      const payload = {
        user: { id: user.id, secretManagerRegion: user.secretManagerRegion },
        dto: dto,
        deploymentConfig: {
          twgId: deploymentInformation.twgId,
          twgArn: deploymentInformation.twgArn,
          securenatgwHubTgwRtb: deploymentInformation.securenatgwHubTgwRtb,
          securenatgwSpokeTgwRtb: deploymentInformation.securenatgwSpokeTgwRtb,
          ...parsedSecret,
        },
      };

      const lambda = new Lambda({ region: this.config.get('LAMBDA_REGION') });
      lambda.invoke(
        {
          FunctionName: this.config.get('LAMBDA_NAME'),
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify(payload),
        },
        async (error, data) => {
          console.log(error, 'error');
          console.log(data, 'data');
          let status = '';
          if (data.FunctionError) {
            status = 'error';
          } else {
            status = 'connected';
          }

          await this.prisma.stackConnector.update({
            where: {
              id,
            },
            data: {
              status: status,
            },
          });

          this.logsGateway.handleEvent('stackConnectorProgress', {
            id,
            status,
          });
        },
      );

      return this.prisma.stackConnector.create({
        data: {
          id,
          status: 'connecting',
          connectorId: dto.connectorId,
          deploymentId: dto.deploymentId,
          userId: user.id,
        },
        include: {
          connector: {
            select: {
              name: true,
            },
          },
          deployment: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
