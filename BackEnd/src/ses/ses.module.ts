import { Global, Module } from '@nestjs/common';
import { SESService } from './ses.service';

@Global()
@Module({ providers: [SESService], exports: [SESService] })
export class SESModule {}
