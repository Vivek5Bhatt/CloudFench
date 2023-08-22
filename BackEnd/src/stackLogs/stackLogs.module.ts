import { Module } from '@nestjs/common';
import { LogsService } from './stackLogs.service';
import { LogsController } from './stackLogs.controller';
import { SecretManagerService } from 'src/secretManager/secretManager.services';

@Module({
  providers: [LogsService, SecretManagerService],
  controllers: [LogsController],
})
export class LogsModule {}
