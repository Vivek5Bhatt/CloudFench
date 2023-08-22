import { ForbiddenException, Injectable } from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteSecretDto, GetSecretDto, UpdateSecretDto } from './dto';

@Injectable()
export class SecretManagerService {
  constructor(private prismaService: PrismaService) {}

  async createSecret(dto: GetSecretDto) {
    const obj = {};
    const secret = new SecretsManager({ region: dto.region });
    try {
      const secretDetails = await secret
        .createSecret({
          SecretString: JSON.stringify(obj),
          Name: dto.secretName,
        })
        .promise();

      return secretDetails;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async updateSecret(dto: UpdateSecretDto) {
    const secret = new SecretsManager({ region: dto.region });
    try {
      const prevSecretString = await this.getSecret({
        secretName: dto.secretName,
        region: dto.region,
      });

      const prevSecret = JSON.parse(
        prevSecretString.secretDetails.SecretString,
      );

      const newSecret = JSON.parse(dto.secretString);

      const updatedSecret = { ...prevSecret, ...newSecret };

      return secret
        .updateSecret({
          SecretId: dto.secretName,
          SecretString: JSON.stringify(updatedSecret),
        })
        .promise();
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getSecret(dto: GetSecretDto): Promise<{
    exists: boolean;
    secretDetails: SecretsManager.GetSecretValueResponse;
  }> {
    const secret = new SecretsManager({ region: dto.region });
    try {
      const secretValues = await secret
        .getSecretValue({
          SecretId: dto.secretName,
        })
        .promise();

      return {
        exists: true,
        secretDetails: secretValues,
      };
    } catch (error) {
      return {
        exists: false,
        secretDetails: {},
      };
      // throw new ForbiddenException(error.message);
    }
  }

  async deleteSecret(dto: DeleteSecretDto) {
    const secret = new SecretsManager({ region: dto.region });
    try {
      const secretValues = await secret
        .deleteSecret({
          RecoveryWindowInDays: 7,
          SecretId: dto.secretName,
        })
        .promise();

      return secretValues;
    } catch (error) {
      throw new Error(error.message);
      // throw new ForbiddenException(error.message);
    }
  }
}
