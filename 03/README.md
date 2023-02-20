# Updating the website to send and receive a text file

## Outline of this section
In this section we will update the website to allow the user to upload a text file and send it to our AWS Lambda.

## Updating the web page
Lets add a simple form into our webpage that allows us to select a file and then upload it to an API endpoint. We will specify only to allow either `jpg` or `png` files to be uploaded.

- Update your `index.html` with the following.
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
        <form id="form">
            <input type="file" id="file" accept=".txt" /><br>
            <button type="submit">Upload file</button>
        </form>
        <script src="main.bundle.js"></script>
    </body>
</html>
```

<a href="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/03/images/website-01.PNG"><img src="https://github.com/adrianeyre/aws-file-upload-tutorial/blob/master/03/images/website-01.PNG" alt="website-01" width="500"/></a>

We now need to add some simple javascript that will accept the uploaded file and POST it onto our API. To test if this is working locally we will first use the POST endpoint of https://httpbin.org/post which will accept a file and return the files information.

- Open your `/src/app.js` file and add the following code.
```js
window.addEventListener('load', function() {
    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault();

        const userFile = document.getElementById('file').files[0];
        const body = new FormData();

        body.append('file', userFile, userFile.name);

        fetch('https://httpbin.org/post', {
            method: 'POST',
            body,
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    });
});
```

What does this file do?
- It firstly waits for the site to load.
- It then adds a listener onto the forms `submit` button.
- When the user presses the `submit` button it gets the uploaded file content from the `file` element on the page.
- It will base64 encode the image so that it can be easily sent.
- It will then create a standard FormData object that will contain any default headers for uploading to an API.
- It will then send the file to our test endpoint of https://httpbin.org/post
  - A successful response will display the details in the browser console.
  - An unsuccessful response will display the error details in the browser console.

Lets test it all works but running `npm start` and going to the locally created IP address of thw web server. You should now be able to upload an image file to the test endpoint and receive a successful response.

## Updating the POST request endpoint
If you can successfully upload an image to the test endpoint you can now simply update the url in the `app.js` file to your AWS Lambda url.

## Redeploying the changes
We now need to push our changes to AWS Amplify so that we can see it in our live environment.
- Type `amplify publish` from your IDE terminal.
- Type `Y` and press `Enter` to confirm the settings.
- The live URL is now shown in the terminal output

❗ If you run the website from the live environment the API response should be the random number text we created in the AWS Lambda