import { Module } from '@nestjs/common';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { StackConnectorController } from './stackConnector.controller';
import { StackConnectorService } from './stackConnector.service';
import { LogGatewayService } from 'src/logGateway/logGateway.service';
@Module({
  providers: [StackConnectorService, SecretManagerService, LogGatewayService],
  controllers: [StackConnectorController],
})
export class StackConnectorModule {}
