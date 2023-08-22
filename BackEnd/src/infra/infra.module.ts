import { Module } from '@nestjs/common';
import { LogGatewayService } from 'src/logGateway/logGateway.service';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { InfraController } from './infra.controller';
import { InfraService } from './infra.service';

@Module({
  providers: [InfraService, LogGatewayService, SecretManagerService],
  controllers: [InfraController],
})
export class InfraModule {}
