import CognitoPassword from 'aws-cognito-temporary-password-generator';

export const generateTempPassword = () => {
  const generator = new CognitoPassword();

  return generator.generate({ length: 8 });
};
