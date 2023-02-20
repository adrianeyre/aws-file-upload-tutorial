import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import { S3 } from "aws-sdk";

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const getAWSSecret = async (secretId: string): Promise<string> => {
  const client = new SecretsManagerClient({
    region: "eu-west-2",
  });

  const secret = await client.send(
    new GetSecretValueCommand({
      SecretId: secretId,
    })
  );

  return secret.SecretString;
}

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
  try {
    const decoded = Buffer.from(event.body, 'base64').toString();
    const filename = decoded.match(/filename=\"(.*)\"/)[1];
    const content = decoded.match(/plain\r\n\r\n(.*)$/m)[1]

    const awsAccessKey = await getAWSSecret('tutorial-access-key');
    const awsSecret = await getAWSSecret('tutorial-secret');
    const awsBucket = await getAWSSecret('tutorial-bucket');

    const bucketConfig = {
      awsAccessKey,
      awsSecret,
    }
  
    const params = {
      Bucket: awsBucket,
      Key: filename,
      Body: content,
    };

    const s3 = new S3({
      accessKeyId: bucketConfig.awsAccessKey,
      secretAccessKey: bucketConfig.awsSecret,
    });

    const result = await s3.upload(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify(error),
    }
  }
};
