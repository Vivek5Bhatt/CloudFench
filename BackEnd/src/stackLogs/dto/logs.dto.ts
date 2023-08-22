import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetStackLogsDto {
  @IsString()
  @IsNotEmpty()
  deploymentId: string;

  @IsNumber()
  @IsNotEmpty()
  offset: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
