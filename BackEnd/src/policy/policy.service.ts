import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { GetPolicyDto } from './dto';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';
@Injectable()
export class PolicyService {
  constructor(
    private prismaService: PrismaService,
    private secretManager: SecretManagerService,
    private httpService: HttpService,
  ) {}

  async getPolicy(dto: GetPolicyDto, req: Request, res: Response) {
    try {
      const user: User = req.user as User;

      const secretDeploymentInformation = await this.secretManager.getSecret({
        region: user.secretManagerRegion,
        secretName: 'stack_' + user.id.concat('_' + dto.deploymentId),
      });

      if (!secretDeploymentInformation.exists)
        throw new BadRequestException('No Secret Found');

      const { fw1_ip, fw1_api } = JSON.parse(
        secretDeploymentInformation.secretDetails.SecretString,
      );

      const result = await axios.get(
        `https://${fw1_ip}:34431/api/v2/cmdb/firewall/policy`,
        {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
          headers: {
            Authorization: `Bearer ${fw1_api}`,
          },
        },
      );

      res.status(200).send(result.data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
