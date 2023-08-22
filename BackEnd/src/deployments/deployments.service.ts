import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeploymentsService {
  constructor(private prisma: PrismaService) {}

  async listDeployments(req: Request, status: string) {
    const { user } = req;
    let progressArr = [];
    switch (status) {
      case 'default':
        progressArr = [
          'success',
          'initializing',
          'provisioning',
          'error',
          'destroying',
        ];
        break;
      case 'stackConnector':
        progressArr = ['success'];
        break;
    }

    try {
      const deployments = await this.prisma.deployments.findMany({
        where: {
          userId: user['id'],
          progress: { in: progressArr },
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

  async listDeploymentsForPolicy(req: Request, type: string) {
    const { user } = req;
    let service;
    switch (type) {
      case 'secure-nat':
        service = 'secureConnectivity';
        break;
      case 'internal-segmentation':
        service = 'workloadProtection';
        break;
    }

    try {
      const deployments = await this.prisma.deployments.findMany({
        where: {
          userId: user['id'],
          progress: 'success',
        },
        orderBy: { createdAt: 'asc' },
      });

      return deployments.filter((deployment) => {
        return deployment.services[service];
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(error.message);
      }
      console.log(error);
    }
  }
}
