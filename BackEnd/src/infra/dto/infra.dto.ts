import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class StackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  progress: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  cloud: string;

  @IsArray()
  @IsNotEmpty()
  az: string[];

  @IsString()
  @IsNotEmpty()
  instance: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsObject()
  services: {
    webWorkLoad: boolean;
    secureConnectivity: boolean;
    workloadProtection: boolean;
  };
}
