# Setting up a basic website and deploying to AWS Amplify

## Outline of this section
In this section we will create a basic web page and deploy it to AWS Amplify. We will make it publicly accessible so that you can view it in your web browser.

## Create a website repositoty
Lets start by creating a new project folder for somewhere to put our code in.
- Create a folder called `aws-amplify-website`
- Navigate into the new folder.
- Open your IDE.

## Installing the AWS Amplify Command Line Interface (CLI)
In order to create and depoy a website to AWS Amplify we need to install the CLI.

- Type the command into your IDE's terminal `npm install -g @aws-amplify/cli`
- Log into youw AWS account.
- Configure Amplify by typing the following command `amplify configure`
- Press `Enter` to continue
- Select `eu-west-2` for `London` region.
- Type `amplify-tutorial-user` for the user name. This will open a new tab to create an IAM (Identity and Access Management) user.

## Creating the IAM user in the AWS Console
We now need a user account within AWS so that we can authenticate the deployment to AWS.
- Make sure the user name is `amplify-tutorial-user`

<a href="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/01/images/user-01.PNG"><img src="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/01/images/user-01.PNG" alt="user-01" width="500"/></a>

- Click the `Next: Permissions` button.
- From the `Policy name` list select `AdministratorAccess-Amplify`

<a href="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/01/images/user-02.PNG"><img src="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/01/images/user-02.PNG" alt="user-02" width="500"/></a>

- Click the `Next: Tags` button.
- Click the `Next: Review` button.
- Click the `Create user` button.
- Take a note of the `Access key ID` and the `Secret access key`.
- Click the `close` button.

## Amplify setup (continued)
- Press `Enter` to continue back in your IDE terminal.
- Enter your `Access key ID`.
- Enter your `Secret access key`.
- Leave the `Profile Name` as `default` by pressing `Enter`.

## Creating the website
Lets now create a really simple web page that we can use for our website.
- Create a `index.html` file with the following HTML
```html
<html>
    <head>
        <title>File Upload Tutorial</title>
    </head>
    <body>
        <h1>File Upload Tutorial</h1>
        <div>
                This website was produced by following the <a href="https://github.com/adrianeyre/aws-file-upload-tutorial">AWS File Upload Tutorial</a>
                that was compiled by <a href="https://github.com/adrianeyre">Adrian Eyre</a> from several different sources that are outlined in the
                <a href="https://github.com/adrianeyre/aws-file-upload-tutorial#Bibliography">GitHub Bibliography Section</a>.
        </div>
    </body>
</html>
```
- Create a blank file called `webpack.config.js`
- Create a blank file called `./src/app.js`
- Create a file called `.gitignore`
- Inisialise the repository by typing `npm init`
  - Enter `aws-amplify-website` for the package name.
  - Enter `1.0.0` for the version.
  - Enter `AWS Amplify Website to upload files` for the description.
  - Enter `webpack.config.js` for the entry point.
  - Leave the test command blank (for now!)
  - Leave the git repository blank
  - Leave the keywords blank
  - Enter your name for the author.
  - Leave the license blank.
  - type `yes` to confirm your settings are correct and press `Enter`
- Install `AWS Amplify` NPM dependency by typing `npm i --save aws-amplify`
- Install some dev dependencies needed by typing `npm i --save-dev webpack webpack-cli webpack-dev-server copy-webpack-plugin`
- Add the following scripts to your `package.json` file.
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack && webpack-dev-server --mode development",
    "build": "webpack"
}
```
- Add the following config to your `webpack.config.js` file
```js
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    client: {
      overlay: true
    },
    hot: true,
    watchFiles: ['src/*', 'index.html']
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ['index.html']
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

## Running the website locally
We can run the website locally to test that it all works and see how it looks!
- Type `npm start` to start the web server.
- Find the IP address from the terminal output of your web server and open it up in a browser.

## Inisialising Amplify
Now it's time to initialise and configure Amplify deployments.
- From your IDE terminal type `amplify init`
- Enter `awsamplifywebsite` for the project name.
- A list of configuration should be shown.
```
| Name: awsamplifywebsite
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: none
| Source Directory Path: src
| Distribution Directory Path: dist
| Build Command: npm.cmd run-script build
| Start Command: npm.cmd run-script start
```
- Type `Y` and press `Enter` to confirm.
- Select `AWS Access Keys`.
- Type your `Access Key ID`.
- Type your `Secret Access Key`.
- Select `eu-west-2` for `London` region.

## Hosting on Amplify
Now that Amplify is initalised correctly we can now configure the deployment.
- Type `amplify add hosting` from your IDE terminal.
- Select `Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)`
- Select `Manual deployment`

## Publishing to Amplify
Excellent we now have a fully configured deployment for Amplify. We can now publish our changes to AWS.
- Add the following `script` to your `pacakge.json` file.
```
"deploy": "webpack&& amplify publish"
```
- Type `npm run publish` from your IDE terminal.
- Type `Y` and press `Enter` to confirm the settings.
- The live URL is now shown in the terminal output

You can also view all the Amplify configuration from the AWS Console.
- Open up the AWS Console.
- In the search bar from the top menu type `Amplify` and select `AWS Amplify` from the results list.
- A list of application should be shown. Click on `awsamplifywebsite`.
- Click on the `Hosting environment` tab.
- The live url will now be shown under the `Domain` section.