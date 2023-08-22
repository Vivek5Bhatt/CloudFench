import { IsNotEmpty, IsString } from 'class-validator';

export class CloudConnectorDto {
  @IsString()
  @IsNotEmpty()
  payload: string;
}

export class DeleteCloudConnectorDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
