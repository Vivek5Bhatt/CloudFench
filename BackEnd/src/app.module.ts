import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { InfraModule } from './infra/infra.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { LogGateway } from './logGateway/logGatway.module';
import { SESModule } from './ses/ses.module';
import { CloudConnectorModule } from './cloudConnector/cloudConnector.module';
import { SecretManagerModule } from './secretManager/secretManager.module';
import { StackConnectorModule } from './stackConnector/stackConnector.module';
import { LogsModule } from './stackLogs/stackLogs.module';
import { PolicyModule } from './policy/policy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    InfraModule,
    DeploymentsModule,
    LogGateway,
    SESModule,
    CloudConnectorModule,
    SecretManagerModule,
    StackConnectorModule,
    LogsModule,
    PolicyModule,
  ],
})
export class AppModule {}
