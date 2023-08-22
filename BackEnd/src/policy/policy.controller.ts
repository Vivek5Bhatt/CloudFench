import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PolicyService } from './policy.service';
import { AuthGuard } from '@nestjs/passport';
import { GetPolicyDto } from './dto';
import { Request, Response } from 'express';

@Controller('policy')
export class PolicyController {
  constructor(private policyService: PolicyService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async getPolicy(
    @Body() body: GetPolicyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.policyService.getPolicy(body, req, res);
  }
}
