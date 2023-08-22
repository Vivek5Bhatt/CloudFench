import { S3 } from '@aws-sdk/client-s3';
import { User } from '@prisma/client';

import {
  appendFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlink,
  unlinkSync,
  writeFile,
  writeFileSync,
} from 'fs';

export const saveLogsToCSV = (content: string, fileName: string) => {
  try {
    appendFileSync(process.cwd().concat(`/${fileName}`), content);
  } catch (error) {
    console.log(error);
  }
};

export const deleteCSV = (fileName: string) => {
  try {
    unlinkSync(process.cwd().concat(`/${fileName}`));
    console.log('File Deleted');
  } catch (error) {
    console.log(error);
  }
};

const getFile = (fileName: string) => {
  try {
    const data = createReadStream(process.cwd().concat(`/${fileName}`));
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const uploadToS3 = async ({
  userId,
  deploymentId,
  errorBucketName,
  bucketRegion,
  fileName,
}: {
  userId: string;
  deploymentId: string;
  errorBucketName: string;
  bucketRegion: string;
  fileName: string;
}) => {
  const file = getFile(fileName);

  const client = new S3({
    region: bucketRegion,
  });

  await client.putObject({
    Bucket: errorBucketName,
    Key: `deploymentlogs/${userId}/${deploymentId}/${fileName}`,
    Body: file,
  });
};

export const logError = async ({
  userId,
  deploymentId,
  progress,
  error,
  errorBucketName,
  bucketRegion,
}) => {
  const fileName = `${userId}-error-logs.csv`;
  const content = `${userId}, ${deploymentId}, ${progress}, ${error}`;
  saveLogsToCSV(content, fileName);

  await uploadToS3({
    userId: userId,
    deploymentId: deploymentId,
    errorBucketName,
    bucketRegion,
    fileName: fileName,
  });
  deleteCSV(fileName);
};

export const getTerraformFiles = (
  bucketName,
  prefix,
  bucketRegion,
  userId,
  deploymentId,
) => {
  return new Promise((resolve) => {
    const client = new S3({
      region: bucketRegion,
    });
    const rootPath = `/terraform/${userId}/${deploymentId}/`;
    client.listObjects(
      {
        Bucket: bucketName,
        // Delimiter: '/',
        Prefix: prefix,
      },
      function (err, data) {
        if (err) {
          return err;
        } else {
          if (!existsSync(process.cwd().concat(rootPath))) {
            mkdirSync(process.cwd().concat(rootPath), {
              recursive: true,
            });
          }

          Promise.all(
            data.Contents.map(async function (obj) {
              if (obj.Key !== prefix) {
                const response = await client.getObject({
                  Bucket: bucketName,
                  Key: obj.Key,
                });

                const withoutPrefix = obj.Key.replace(prefix, '');

                const pathArray = withoutPrefix.split('/');

                if (pathArray.length > 1) {
                  pathArray.pop();
                  const newPath = pathArray.join('/');
                  const absolutePath = process.cwd().concat(rootPath + newPath);
                  if (!existsSync(absolutePath)) {
                    mkdirSync(absolutePath, {
                      recursive: true,
                    });
                  }
                }
                writeFile(
                  process.cwd().concat(`${rootPath}${withoutPrefix}`),
                  await response.Body.transformToString(),
                  function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                  },
                );
              }
            }),
          ).then((result) => resolve(result));
        }
      },
    );
  });
};

export const deleteTerraformDir = (userId, deploymentId) => {
  try {
    const terraformDir = process
      .cwd()
      .concat('/terraform/' + userId + '/' + deploymentId);
    if (!existsSync(terraformDir)) {
      return;
    }
    const data = readdirSync(terraformDir);
    data.map((fileName) => {
      rmSync(`${terraformDir}/${fileName}`, {
        recursive: true,
        force: true,
      });
    });
  } catch (error) {
    throw error;
  }
};

export const updateVars = async (stack: any, user: User) => {
  try {
    // Todo: make the following more robust
    const fileContentRaw = readFileSync(
      process
        .cwd()
        .concat(`/terraform/${user.id}/${stack.id}/terraform.tfvars.json`),
    ).toString();

    const fileContent = JSON.parse(fileContentRaw);

    fileContent.stack = stack.id;
    fileContent.tenant = user.id;
    fileContent.region = stack.region;
    fileContent.az = stack.az;
    fileContent.fw_size = stack.instance;
    writeFileSync(
      process
        .cwd()
        .concat(`/terraform/${user.id}/${stack.id}/terraform.tfvars.json`),
      JSON.stringify(fileContent),
    );
  } catch (error) {
    throw error;
  }
};

export const mapInstance = (instanceSize: string): string => {
  if (instanceSize === 'Very Small') {
    return 'c6i.large';
  } else if (instanceSize === 'Small') {
    return 'c6i.xlarge';
  }
};

export const codeGen = () => {
  const minm = 100000;
  const maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
};
