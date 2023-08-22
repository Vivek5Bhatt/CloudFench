import { Module } from '@nestjs/common';
import { SecretManagerService } from 'src/secretManager/secretManager.services';
import { CloudConnectorController } from './cloudConnector.controller';
import { CloudConnectorService } from './cloudConnector.service';

@Module({
  providers: [CloudConnectorService, SecretManagerService],
  controllers: [CloudConnectorController],
})
export class CloudConnectorModule {}
