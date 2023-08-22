import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
  ],
  providers: [PolicyService, SecretManagerService],
  controllers: [PolicyController],
})
export class PolicyModule {}
