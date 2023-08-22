import { IsNotEmpty, IsString } from 'class-validator';

export class GetPolicyDto {
  @IsNotEmpty()
  @IsString()
  deploymentId: string;
}
