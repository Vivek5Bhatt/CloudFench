import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CloudConnectorService } from './cloudConnector.service';
import { CloudConnectorDto, DeleteCloudConnectorDto } from './dto';

@Controller('cloud-connector')
export class CloudConnectorController {
  constructor(private cloudConnectorService: CloudConnectorService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  addCloudConnector(@Body() dto: CloudConnectorDto, @Req() req: Request) {
    return this.cloudConnectorService.addCloudConnector(req, dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listCloudConnectors(@Req() req: Request) {
    return this.cloudConnectorService.listCloudConnectors(req);
  }

  @Get('policy/:cloud')
  @UseGuards(AuthGuard('jwt'))
  getPolicy(@Param() params) {
    return this.cloudConnectorService.getPolicy(params.cloud);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  updateCloudConnector(@Body() dto: CloudConnectorDto, @Req() req: Request) {
    return this.cloudConnectorService.updateCloudConnector(req, dto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteCloudConnector(@Param('id') id: string, @Req() req: Request) {
    return this.cloudConnectorService.deleteCloudConnector(req, id);
  }
}
