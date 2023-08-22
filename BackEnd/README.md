### Cloud Fence Backend

---

The application is developed using Nest.js and all the packages/libraries used can be found in package.json folder.

---

## Running the application

For successfully running the application you need to perform the following steps.

1. You need to set up the following envs to make the code work.

```
DATABASE_URL=""
AWS_COGNITO_USER_POOL_ID=""
AWS_COGNITO_CLIENT_ID=""
AWS_COGNITO_AUTHORITY=""
MAIN_TF_FILE=""
S3_PREFIX=""
BUCKET_NAME=""
BUCKET_REGION=""
ERROR_BUCKET_NAME=""
SES_IDENTITY_SOURCE=""
SES_IDENTITY_DESTINATION=""
SES_REGION=""
SECRET_KEY=""
LAMBDA_REGION=""
LAMBDA_NAME=""
```

2. Make sure you are exposing the proper AWS credentials to your application. You can check the precedence regarding how AWS SDK picks the credentials, using this [link.](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)

3. For executing the application in prod on a AWS Instance, install the packages using npm install. Make sure you have Node JS v16 configured and also have pm2 installed.

4. Following are the commands for running the application:
   1. Build the app using `npm run build`
   2. Start the build using `pm2 start dist/main.js`

---
Some important commands:

1. For stopping the server `pm2 stop main`
2. For listing the running servers `pm2 ls`
3. For pm2 logs run `pm2 logs`
