import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthChangePasswordDto,
  AuthConfirmPasswordDto,
  AuthForgotPasswordDto,
  AuthResendConfirmationCode,
  AuthSigninDto,
  AuthSignupDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() dto: AuthSigninDto) {
    return this.authService.authenticateUser(dto);
  }

  @Post('signup')
  signup(@Body() dto: AuthSignupDto) {
    return this.authService.registerUser(dto);
  }

  @Post('change-password')
  changeUserPassword(@Body() dto: AuthChangePasswordDto) {
    return this.authService.changeUserPassword(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: AuthForgotPasswordDto) {
    return this.authService.forgotUserPassword(dto);
  }

  @Post('confirm-password')
  confirmPassword(@Body() dto: AuthConfirmPasswordDto) {
    return this.authService.confirmUserPassword(dto);
  }

  @Post('resend-code')
  resendConfirmationCode(@Body() dto: AuthResendConfirmationCode) {
    return this.authService.resendConfirmationCode(dto);
  }

  // @Post('passwordChallenge')
  // passwordChallenge(@Body() dto: AuthSigninDto) {
  //   return this.authService.passwordChallenge(dto);
  // }
}
