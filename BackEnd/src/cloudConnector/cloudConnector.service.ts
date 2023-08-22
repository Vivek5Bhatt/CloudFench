import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudConnectorDto, DeleteCloudConnectorDto } from './dto';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AwsPolicy } from './policies/policiy_aws';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { ConfigService } from '@nestjs/config';
import { AES, enc } from 'crypto-js';
import { UpdateSecretDto } from 'src/secretManager/dto';
@Injectable()
export class CloudConnectorService {
  constructor(
    private prismaService: PrismaService,
    private secretManagerService: SecretManagerService,
    private config: ConfigService,
  ) {}

  async addCloudConnector(req: Request, dto: CloudConnectorDto) {
    try {
      const bytes = AES.decrypt(dto.payload, this.config.get('SECRET_KEY'));
      const decryptedData: {
        name: string;
        cloud: string;
        apiKey: string;
        secretKey: string;
        accountId: string;
      } = JSON.parse(bytes.toString(enc.Utf8));

      const id = uuidv4();

      const connectorSecretName = 'connector_' + req.user['id'] + '_' + id;
      const connectorSecretRegion = req.user['secretManagerRegion'];

      const secretDetail = await this.secretManagerService.getSecret({
        secretName: connectorSecretName,
        region: connectorSecretRegion,
      });

      if (!secretDetail.exists) {
        await this.secretManagerService.createSecret({
          secretName: connectorSecretName,
          region: connectorSecretRegion,
        });
      }

      const secretManagerdto = new UpdateSecretDto();

      secretManagerdto.secretString = JSON.stringify({
        AWS_API_KEY: decryptedData.apiKey,
        AWS_SECRET_KEY: decryptedData.secretKey,
        AccountID: decryptedData.accountId,
      });

      secretManagerdto.region = connectorSecretRegion;

      secretManagerdto.secretName = connectorSecretName;

      await this.secretManagerService.updateSecret(secretManagerdto);

      const cloudConnector = await this.prismaService.cloudConnector.create({
        data: {
          id,
          cloud: decryptedData.cloud,
          name: decryptedData.name,
          status: 'connected',
          userId: req.user['id'],
          accessKey: decryptedData.apiKey,
          accountId: decryptedData.accountId,
        },
      });

      if (!cloudConnector) {
        throw new Error('Failed to add Cloud Connector to DB');
      }

      return cloudConnector;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async updateCloudConnector(req: Request, dto: CloudConnectorDto) {
    try {
      const bytes = AES.decrypt(dto.payload, this.config.get('SECRET_KEY'));
      const decryptedData: {
        id: string;
        name: string;
        cloud: string;
        apiKey: string;
        secretKey: string;
        accountId: string;
      } = JSON.parse(bytes.toString(enc.Utf8));

      const connectorSecretName =
        'connector_' + req.user['id'] + '_' + decryptedData.id;
      const connectorSecretRegion = req.user['secretManagerRegion'];

      const secretManagerdto = new UpdateSecretDto();

      secretManagerdto.secretString = JSON.stringify({
        AWS_API_KEY: decryptedData.apiKey,
        AWS_SECRET_KEY: decryptedData.secretKey,
        AccountID: decryptedData.accountId,
      });

      secretManagerdto.region = connectorSecretRegion;

      secretManagerdto.secretName = connectorSecretName;

      await this.secretManagerService.updateSecret(secretManagerdto);

      const cloudConnector = await this.prismaService.cloudConnector.update({
        where: {
          id: decryptedData.id,
        },
        data: {
          cloud: decryptedData.cloud,
          name: decryptedData.name,
          status: 'connected',
          userId: req.user['id'],
          accessKey: decryptedData.apiKey,
          accountId: decryptedData.accountId,
        },
      });

      if (!cloudConnector) {
        throw new Error('Failed to update Cloud Connector to DB');
      }

      return cloudConnector;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async listCloudConnectors(req: Request) {
    try {
      const deployments = await this.prismaService.cloudConnector.findMany({
        where: {
          userId: req.user['id'],
        },
        orderBy: { createdAt: 'asc' },
      });

      return deployments;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      console.log(error);
    }
  }

  async deleteCloudConnector(req: Request, id: string) {
    try {
      const connectorInfo = await this.prismaService.cloudConnector.findFirst({
        where: { id },
      });

      const stackConnector = await this.prismaService.stackConnector.findMany({
        where: {
          connectorId: id,
          status: 'connected',
        },
        include: {
          deployment: {
            select: {
              name: true,
            },
          },
        },
      });

      if (stackConnector.length) {
        return {
          status: 400,
          message:
            'Connector is associated with the following:' +
            stackConnector
              .map((connector) => `\n${connector.deployment.name}`)
              .join(','),
        };
      }

      const connectorSecretName = 'connector_' + req.user['id'] + '_' + id;
      const connectorSecretRegion = req.user['secretManagerRegion'];

      await this.secretManagerService.deleteSecret({
        region: connectorSecretRegion,
        secretName: connectorSecretName,
      });

      await this.prismaService.stackConnector.deleteMany({
        where: { connectorId: id },
      });
      await this.prismaService.cloudConnector.delete({ where: { id } });

      return {
        status: 200,
        message: 'Successfully Deleted Connector ' + connectorInfo.name,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getPolicy(cloud) {
    if (cloud.toLowerCase() === 'aws') {
      return AwsPolicy;
    }
  }
}
