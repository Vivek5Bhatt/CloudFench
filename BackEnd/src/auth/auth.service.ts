import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  AuthChangePasswordDto,
  AuthConfirmPasswordDto,
  AuthForgotPasswordDto,
  AuthResendConfirmationCode,
  AuthSigninDto,
  AuthSignupDto,
} from './dto';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { PrismaService } from 'src/prisma/prisma.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { generateTempPassword } from './helpers';
@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;

  constructor(private config: ConfigService, private prisma: PrismaService) {
    this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
      region: this.config.get('BUCKET_REGION'),
    });
    this.userPool = new CognitoUserPool({
      UserPoolId: this.config.get('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.config.get('AWS_COGNITO_CLIENT_ID'),
    });
  }

  async registerUser(authRegisterUserDto: AuthSignupDto) {
    const {
      firstName,
      lastName,
      address,
      state,
      country,
      postalCode,
      email,
      industry,
      businessName,
    } = authRegisterUserDto;

    const tempPass = generateTempPassword();
    try {
      const uniqueUser = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (uniqueUser) {
        throw Error('A user with the same email already exists.');
      }

      const result = await this.cognitoIdentityServiceProvider
        .adminCreateUser({
          UserPoolId: this.config.get('AWS_COGNITO_USER_POOL_ID'),
          Username: email,
          TemporaryPassword: tempPass,
          UserAttributes: [{ Name: 'name', Value: `${firstName} ${lastName}` }],
        })
        .promise();

      const user = await this.prisma.user.create({
        data: {
          id: result.User.Username,
          email,
          firstName,
          lastName,
          address,
          state,
          country,
          postalCode,
          industry,
          businessName,
        },
      });

      return user;
    } catch (e: any) {
      console.log('Error:', e);
      throw new ForbiddenException(e.message);
    }
  }

  async authenticateUser(authLoginUserDto: AuthSigninDto) {
    const { email, password } = authLoginUserDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          delete userAttributes.email_verified;
          if (authLoginUserDto.newPassword) {
            userCognito.completeNewPasswordChallenge(
              authLoginUserDto.newPassword,
              requiredAttributes,
              {
                onSuccess: (session) => {
                  resolve({
                    accessToken: session.getAccessToken().getJwtToken(),
                    refreshToken: session.getRefreshToken().getToken(),
                  });
                },
                onFailure: function (err: Error): void {
                  reject(err.message);
                },
              },
            );
          } else
            resolve({
              newPasswordRequired: true,
            });
        },
        onFailure: (err) => {
          console.log(err);
          reject(new BadRequestException(err.code));
        },
      });
    });
  }

  // async passwordChallenge(authLoginUserDto: AuthSigninDto) {
  //   const { email, password } = authLoginUserDto;
  //   const userData = {
  //     Username: email,
  //     Pool: this.userPool,
  //   };

  //   const userCognito = new CognitoUser(userData);
  //   return new Promise((resolve, reject) => {
  //     userCognito.completeNewPasswordChallenge(password, [], {
  //       onSuccess: (session) => {
  //         resolve({
  //           accessToken: session.getAccessToken().getJwtToken(),
  //           refreshToken: session.getRefreshToken().getToken(),
  //         });
  //       },
  //       onFailure: function (err: Error): void {
  //         reject(err.message);
  //       },
  //     });
  //   });
  // }

  async resendConfirmationCode(
    authResendConfirmationCode: AuthResendConfirmationCode,
  ) {
    const { email } = authResendConfirmationCode;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.resendConfirmationCode((err, result) => {
        if (err) {
          reject(new ForbiddenException(err.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  async changeUserPassword(authChangePasswordUserDto: AuthChangePasswordDto) {
    const { email, currentPassword, newPassword } = authChangePasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPassword,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          userCognito.changePassword(
            currentPassword,
            newPassword,
            (err, result) => {
              if (err) {
                reject(new ForbiddenException(err.message));
                return;
              }
              resolve(result);
            },
          );
        },
        onFailure: (err) => {
          reject(new ForbiddenException(err.message));
        },
      });
    });
  }

  async forgotUserPassword(authForgotPasswordUserDto: AuthForgotPasswordDto) {
    const { email } = authForgotPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(new ForbiddenException(err.message));
        },
      });
    });
  }

  async confirmUserPassword(
    authConfirmPasswordUserDto: AuthConfirmPasswordDto,
  ) {
    const { email, confirmationCode, newPassword } = authConfirmPasswordUserDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => {
          resolve({ status: 'success' });
        },
        onFailure: (err) => {
          reject(new ForbiddenException(err.message));
        },
      });
    });
  }
}
