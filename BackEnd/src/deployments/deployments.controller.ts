import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeploymentsService } from './deployments.service';

@Controller('deployments')
export class DeploymentsController {
  constructor(private deploymentService: DeploymentsService) {}
  @Get('/:status')
  @UseGuards(AuthGuard('jwt'))
  listDeployments(@Req() req: Request, @Param('status') status: string) {
    return this.deploymentService.listDeployments(req, status);
  }

  @Get('policy/:type')
  @UseGuards(AuthGuard('jwt'))
  listDeploymentsForPolicy(@Req() req: Request, @Param('type') type: string) {
    return this.deploymentService.listDeploymentsForPolicy(req, type);
  }
}
