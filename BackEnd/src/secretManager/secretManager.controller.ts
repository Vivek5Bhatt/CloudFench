import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteSecretDto, GetSecretDto, UpdateSecretDto } from './dto';
import { SecretManagerService } from './secretManager.services';

@Controller('secret')
export class SecretManagerController {
  constructor(private secretService: SecretManagerService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createSecret(@Body() body: GetSecretDto) {
    return this.secretService.createSecret(body);
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  updateSecret(@Body() body: UpdateSecretDto) {
    return this.secretService.updateSecret(body);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  getSecret(@Body() body: GetSecretDto) {
    return this.secretService.getSecret({
      secretName: body.secretName,
      region: body.region,
    });
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  deleteSecret(@Body() body: DeleteSecretDto) {
    return this.secretService.deleteSecret({
      secretName: body.secretName,
      region: body.region,
    });
  }
}
