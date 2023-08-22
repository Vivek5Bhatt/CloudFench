import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { StackDto } from './dto';
import { InfraService } from './infra.service';

@Controller('infra')
export class InfraController {
  constructor(private infraService: InfraService) {}

  @Post('deploy')
  @UseGuards(AuthGuard('jwt'))
  deploy(@Req() req: Request, @Res() res: Response, @Body() dto: StackDto) {
    return this.infraService.initialize(req, res, dto);
  }

  @Delete('destroy/:id')
  @UseGuards(AuthGuard('jwt'))
  destroy(@Req() req: Request, @Res() res: Response, @Param() params) {
    return this.infraService.destroy(req, res, params.id);
  }

  @Get('sendTwoFaEmail')
  @UseGuards(AuthGuard('jwt'))
  async sendTwoFaEmail(@Req() req: Request, @Res() res: Response) {
    return this.infraService.sendTwoFaEmail(req, res);
  }
}
