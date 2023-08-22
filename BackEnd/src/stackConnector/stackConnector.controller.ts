import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  StackConnectorDtoAdd,
  StackConnectorDtoSubnet,
  StackConnectorDtoVPC,
} from './dto';
import { StackConnectorService } from './stackConnector.service';

@Controller('stack-connector')
export class StackConnectorController {
  constructor(private stackConnectorService: StackConnectorService) {}
  @Post('vpc')
  @UseGuards(AuthGuard('jwt'))
  async getVPC(@Body() dto: StackConnectorDtoVPC, @Req() req: Request) {
    return this.stackConnectorService.getVPC(dto, req);
  }

  @Post('subnet')
  @UseGuards(AuthGuard('jwt'))
  async getSubnets(@Body() dto: StackConnectorDtoSubnet, @Req() req: Request) {
    return this.stackConnectorService.getSubnets(dto, req);
  }

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  async addStackConnector(
    @Body() dto: StackConnectorDtoAdd,
    @Req() req: Request,
  ) {
    return this.stackConnectorService.addStackConnector(dto, req);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async getStackConnector(@Req() req: Request) {
    return this.stackConnectorService.getStackConnectors(req);
  }
}
