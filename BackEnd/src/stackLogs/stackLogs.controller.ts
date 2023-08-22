import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GetStackLogsDto } from './dto/logs.dto';
import { LogsService } from './stackLogs.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}
  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async getLogs(@Body() body: GetStackLogsDto, @Req() req: Request) {
    return this.logsService.getLogs(body, req);
  }
}
