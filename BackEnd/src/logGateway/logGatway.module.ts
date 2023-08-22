import { Module } from '@nestjs/common';
import { LogGatewayService } from './logGateway.service';

@Module({ providers: [LogGatewayService] })
export class LogGateway {}
