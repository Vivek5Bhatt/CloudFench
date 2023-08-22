import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class AuthSignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsNumber()
  @IsNotEmpty()
  postalCode: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class AuthSigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*.\[\]{}\(\)?\-"!@#%&\/\\,><':;|_~`]).{8,}/,
    { message: 'invalid password' },
  )
  password: string;

  @IsOptional()
  @IsString()
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*.\[\]{}\(\)?\-"!@#%&\/\\,><':;|_~`]).{8,}/,
    { message: 'invalid new password' },
  )
  newPassword: string;
}

export class AuthChangePasswordDto {
  @IsEmail()
  email: string;

  /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  currentPassword: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  newPassword: string;
}

export class AuthForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class AuthConfirmPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  confirmationCode: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  newPassword: string;
}

export class AuthResendConfirmationCode {
  @IsEmail()
  email: string;
}
