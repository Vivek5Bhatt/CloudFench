import { Module } from '@nestjs/common';
import { SecretManagerController } from './secretManager.controller';
import { SecretManagerService } from './secretManager.services';

@Module({
  providers: [SecretManagerService],
  controllers: [SecretManagerController],
  exports: [SecretManagerService],
})
export class SecretManagerModule {}
