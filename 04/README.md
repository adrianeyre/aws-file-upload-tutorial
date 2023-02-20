# Creating an AWS S3 Bucket

## Outline of this section
In this section we will create an AWS S3 Bucket and set up authentication ready for the AWS Lambda to use.

## Create the Bucket in AWS Console
Lets start by opening the AWS Console and creating a bucket for us to use.
- Open up the AWS Console.
- From the search bar type `S3`
- Select `S3` from the search results.
- Click the `Create bucket` button.
- Type `upload-tutorial` in the bucket name field.
- Select `eu-west-2` for the region.

## Giving your AWS Lambda access
### Getting the role
So that the AWS Lambda can write to the newly created bucket we need to give it access! Firstly we need to check which `role` is assigned to your Lambda function so that we can give it the correct access.
- Open the AWS Console.
- From the search bar type `Lambda`
- Select `Lambda` from the search results.
- Find your lambda from the list and select it.
- Click `Configuration` tab.
- Make a note of the `Role name` under the `Execution role`.

<a href="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/04/images/lambda-01.PNG"><img src="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/04/images/lambda-01.PNG" alt="user-02" width="500"/></a>

### Assigning the permission
We now need to assign the correct permission to the role.
- Open the AWS Console.
- From the search bar type `IAM`
- Select `IAM` from the search results.
- Select `Roles` from the left hand menu.
- Type the name of your role into the `filter`.
- Select your role from the search results.
- From the `Permissions policies` section click `Add permissions` and then select `Attach policies`.
- Search for and add the following two permissions
  - AmazonS3FullAccess
  - SecretsManagerReadWrite

❗ We are also adding the secrets manager in here now so that when we update the Lambda in the next section it will have access to the AWS Secrets Manager for the bucket configuration.