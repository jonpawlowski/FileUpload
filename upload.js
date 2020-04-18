// define URL and form element
const uploadUrl = global.gConfig.uploadUrl;
const form = document.querySelector('form');

// add event listener
form.addEventListener('submit', e => {

    // disable default action
    e.preventDefault();

    // collect files
    const files = document.querySelector('[name=file]').files;
    const formData = new FormData();
    formData.append('newFile', files[0]);

    // post form data
    const xhr = new XMLHttpRequest();

    // log response
    xhr.onload = () => {
        console.log(xhr.responseText);
    };

    // listen for `upload.error` event
    xhr.upload.onerror = () => {
        console.error('Upload failed.');
    }

    // listen for `upload.abort` event
    xhr.upload.onabort = () => {
        console.error('Upload cancelled.');
    }

    // listen for `progress` event
    xhr.upload.onprogress = (event) => {
        // event.loaded returns how many bytes are downloaded
        // event.total returns the total number of bytes
        // event.total is only available if server sends `Content-Length` header
        console.log(`Uploaded ${event.loaded} of ${event.total} bytes`);
    }
    // create and send the reqeust
    xhr.open('POST', uploadUrl);
    console.log(uploadUrl);
    xhr.send(formData);
});
