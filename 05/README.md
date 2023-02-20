# Updating the Lambda to accept the text file and upload to the bucket

## Outline of this section
In this section we will update our AWS Lambda handler to accept the text from the incoming POST request. We will then send that to our newley created S3 Bucket.

## Creating AWS Secrets
So that we do not have any secrets in our code it is essential we use AWS secrets to store them. We can then update our code to read these secrets and use them appropriately.
- Open the AWS Console.
- From the search bar type `Secrets`
- Select `Secrets` from the search results.
- Click the `Store a new secret` button.
- Selecct `Other type of secret` from the `Secret type`.
- Select `Plaintext` tab for the `Key/value pairs`

You will need to create three secrets in total.
- `tutorial-bucket` with the value of `upload-tutorial` (the name of the S3 bucket we created in the previous section).
- `tutorial-secret` with the value of your secret you created in section 1.
- `tutorial-access-key` with the value of your access key you created in section 1.

## Create a simple text file
This is a very basic example of how we can decode and send a text file to the bucket so lets create a simple file to make life easy!
- Create a file called `test.txt`
- Open the file add simply add one line `test` to the file.
- Save and close the file.

## Updating the function
So lets update the function with the below code which will be explained just below.

```js
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
```
So a lot has changed! so lets look deeper into what is happening.
- The `handler` function accepts an `event`. This will be firstly base 64 encoded and in the FormData format. An example of this for our `test.txt` file is.
```
------WebKitFormBoundaryEHBXIXiaynzSGgD6\r\nContent-Disposition: form-data; name=\"file\"; filename=\"test.txt\"\r\nContent-Type: text/plain\r\n\r\ntest\r\n------WebKitFormBoundaryEHBXIXiaynzSGgD6--\r\n
```
- Line 40 will decode the base 64 request into a string.
- Line 41 and 42 will extract the filename and content from the decoded request.
- Lines 44 to 46 uses a new function we've created that will ask AWS Secrets for a secret that we have previously set.
- Lines 48 to 62 will set up the S3 Bucket configuration
- Line 64 will send the text file to the S3 Bucket.

## Testing the upload
All we need to do now is go to our live website url and upload our `test.txt` file. It should upload the file and save it into your S3 Bucket.