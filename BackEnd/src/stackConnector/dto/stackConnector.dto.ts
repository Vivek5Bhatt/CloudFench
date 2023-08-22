import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class StackConnectorDtoVPC {
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  connectorId: string;
}

export class StackConnectorDtoSubnet {
  @IsString()
  @IsNotEmpty()
  vpcs: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsNotEmpty()
  @IsString()
  connectorId: string;
}

export class StackConnectorDtoAdd {
  @IsString()
  @IsNotEmpty()
  vpc: string;

  @IsArray()
  @IsNotEmpty()
  subnets: string[];

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsNotEmpty()
  @IsString()
  connectorId: string;

  @IsNotEmpty()
  @IsString()
  deploymentId: string;
}
