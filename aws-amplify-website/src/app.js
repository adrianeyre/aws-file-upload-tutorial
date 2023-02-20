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
