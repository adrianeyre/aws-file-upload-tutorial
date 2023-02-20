# Setting up an AWS Lambda and deploying to AWS using GitHub Actions

## Outline of this section
In this section we are going to create an AWS Lambda that we can access via the internet. We will then create a GitHub repository to update the lambda and deploy andy commited changes.

## Create a new AWS Lambda in the Console.
So lets firstly go into the AWS Console and create a lambda so that we can make a basic lambda and set any defaults .
- Open the AWS Console.
- From the search bar type `Lambda`
- Select `Lambda` from the search results.
- Click the `Create function` button in the top right.
- Name the function `aws-tutorial`

<a href="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/02/images/create-lambda-01.PNG"><img src="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/02/images/create-lambda-01.PNG" alt="create-lambda-01" width="500"/></a>

- Click the `Create fucntion` button.

## Adding a trigger for the API
- Click `+ Add tigger` button

<a href="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/02/images/create-lambda-02.PNG"><img src="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/02/images/create-lambda-02.PNG" alt="create-lambda-02" width="500"/></a>

- From `Select a source` choose `API Gateway`
- Select `Create a new API` for your Intent.
- Select `Open` under `Security`
- Expand `Additional settings`
  - Check `Cross-origin resource sharing (CORS)`
- Click the `Add` button.
From the `General configuration` left hand menu you can now select `Triggers` which should now display the API endpoint that you can now use.

## Create the Lambda repository
We now need to create a GitHub repository containing our lambda code. This is where we will deploy our code from to AWS.
- Create a new GirHub repository called `aws-lambda-tutorial` from the GitHub website.
- Clone the new repository to your local machine.
- Open your IDE in the new folder and open a terminal.
- Initialise NPM by typing `npm init`
  - Type `aws-lambda-tutorial` for the package name.
  - Type `1.0.0` for the version.
  - Type `AWS Lambda tutorial` for the description.
  - Type `index.ts` for the entry point.
  - Leave the test command blank (for now!).
  - Leave the git repository blank
  - Leave the keywords blank
  - Enter your name for the author
  - Leave the license blank
  - type `yes` and press `Enter` to confirm the configuration
- Create a new file called `index.ts`
- Create a new file called `.gitignore` and add the folling lines.
```
node_modules
dist
deploy.zip
.env
```

- Install Typescript by typing `npm i --save typescript`
- Install some dev dependancies `npm i --save-dev @types/node @types/aws-lambda @vercel/ncc`
- Create a new file called `tsconfig.json` and add the following configuration
```json
{
  "compilerOptions": {
    "target": "es2015",
    "moduleResolution": "node"
  }
}
```

## Creating the lambda
To know what to name your lambda function you first need to know where to find the configuration in the AWS Console.
- From your AWS Lambda select the `Code` tab
- Scroll down to the `Runtime settings` section
- Under `Handler` the default value should say `index.handler`. This means the file name needs to be called `index` and the function needs to be called `handler`.

<a href="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/02/images/create-lambda-03.PNG"><img src="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/02/images/create-lambda-03.PNG" alt="create-lambda-03" width="500"/></a>

Lets start coding a simple lambda function that will generate a random number and return it back to the user. We will do this in typescript but further in this section we will compile it to javascript so that it can be used in AWS.
- From your new `aws-lambda-tutorial` repository open the `index.ts` file and type the below code.
```ts
import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
  const max = 999;
  const value = Math.floor(Math.random() * max) + 1;

  const response = {
    statusCode: 200,
    body: `The random value (max ${max}) is: ${value}`,
  };

  return response;
};
```

## Create GitHub Action to deploy the Lambda
In order to build and deploy the code within the repository we need to create a GitHub Action to do this for us. This will be ran everytime we commit and push to the `master` branch.
- Create a folder called `.github`
- In the `.github` folder create a new folder called `workflows`
- In the `workflows` folder create a new file called `main.yml`
- Add the below code to the new file

```yml
name: Deploy

on:
  push:
    branches:
    - master

jobs:
  deploy_lambda:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-2
      - name: npm install
        env:
          CI: true
        run: |
          npm ci
      - name: deploy
        run: |
          npx ncc build index.ts
          zip -j deploy.zip ./dist/*
          aws lambda update-function-code --function-name=aws-tutorial --zip-file=fileb://deploy.zip
```

What is happening in this GitHub Action?
- We have named the workflow `Deploy`
- On every push to the branch `master` the jobs will run.
- We have a job called `deploy_lambda` that will run on `ubuntu-latest`.
- It will run the following steps
  - Check out the GitHub repository.
  - Install NodeJS version `16`.
  - Instalises AWS authentication.
  - Installs NPM packages.
  - Deploy the function to AWS

## Setting up NCC to deploy the code
NCC is a simple CLI for compiling a Node.js module into a single file, together with all its dependencies, gcc-style. You can view the [GitHub Repository](https://github.com/vercel/ncc) for more information. We use NCC to convert the typescript code to javascript in order for AWS to use it.
- From your IDE terminal type `npx ncc build index.ts`

This will create a new folder called `dist`. It has also converted our typescript to javascript ready to be deployed to AWS.

## Packaging the compiled function code
We need to now make a zip file of the newly created js file so it can be deployed easily to AWS.

❗ The GitHub action uses the Linux/Ubuntu command

### Running locally on Windows
- For Windows you will need to download [7-Zip](https://7-zip.org)
- Update the `PATH` [Windows Environment Variable](https://www.computerhope.com/issues/ch000549.htm#1) to include `C:\Program Files\7-Zip\7z.exe`
- Run the command `7z a -tzip deploy.zip ./dist/*` from the terminal.

### Running locally on Linux
- Run the command `zip -j deploy.zip ./dist/*` from the terminal.

## Deploying the lambda
Let's test the deployment locally! To do this we need to use the AWS CLI.
- Type `aws lambda update-function-code --function-name=aws-tutorial --zip-file=fileb://deploy.zip`

The deployment should have been successfully deployed to AWS. Let's check to see if it has.
- Open the AWS Console.
- Navigate to `Lambda`.
- Open up your `Lambda`.
- Select `Code` tab.

The new compiled version of your handler should now be deployed.

## Adding AWS credentials to the GitHub Action
Running the AWS CLI locally should work because it will use pre configured credentials on your local machine. However the GitHub Action will not know these credentials so we need to add them. There is a GitHub action called [Configure AWS Credentials](https://github.com/aws-actions/configure-aws-credentials) that configures AWS credentials using GitHub secrets. We use this in our action in the `Configure AWS Credentials` step.

### Adding the GitHub Secrets
We now need to add the GitHub secrets so that they can be used by the GitHub Action to authenticate into AWS.
- Open your repository in GitHub.
- Click on `Settings` from the top menu.
- Click `Secrets and variables` from the left hand menu.
- Click `Actions` from this dropdown.

### AWS_ACCESS_KEY_ID Secret
- Click the `New repository secret` button.
- Enter `AWS_ACCESS_KEY_ID` in the `Name` field.
- Enter your `AWS Access Key` that you created in step 01 of this tutorial.

### AWS_SECRET_ACCESS_KEY Secret
- Click the `New repository secret` button.
- Enter `AWS_SECRET_ACCESS_KEY` in the `Name` field.
- Enter your `AWS Secret` that you created in step 01 of this tutorial.

## Deploy the changes to AWS
.Simply commit and push all of your code to the `master` branch! The GitHub Action should automatically start and deploy any changes to AWS. You can now go to your URL that was created by AWS to test the cahnge.