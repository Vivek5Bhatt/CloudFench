import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSecretDto {
  @IsNotEmpty()
  @IsString()
  secretString: string;

  @IsNotEmpty()
  @IsString()
  secretName: string;

  @IsNotEmpty()
  @IsString()
  region: string;
}

export class GetSecretDto {
  @IsNotEmpty()
  @IsString()
  secretName: string;

  @IsNotEmpty()
  @IsString()
  region: string;
}

export class DeleteSecretDto {
  @IsNotEmpty()
  @IsString()
  secretName: string;

  @IsNotEmpty()
  @IsString()
  region: string;
}
