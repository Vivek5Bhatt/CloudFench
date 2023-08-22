import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { GetStackLogsDto } from './dto/logs.dto';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { Request } from 'express';
import { User } from '@prisma/client';
import { Lambda } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogsService {
  constructor(
    private secretService: SecretManagerService,
    private configService: ConfigService,
  ) {}
  async getLogs(dto: GetStackLogsDto, req: Request) {
    try {
      const user: User = req.user as User;

      const payload = {
        user: { id: user.id, secretManagerRegion: user.secretManagerRegion },
        dto: dto,
        type: 'logs',
      };

      const lambda = new Lambda({
        region: this.configService.get('LAMBDA_REGION'),
      });

      const result = await lambda
        .invoke({
          FunctionName: this.configService.get('LAMBDA_NAME'),
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify(payload),
        })
        .promise();

      if (result.FunctionError) {
        return { status: 400, payload: JSON.parse(result.Payload.toString()) };
      }

      return { status: 200, payload: JSON.parse(result.Payload.toString()) };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
