const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, '/')));

//start app
const config = require('./config/config.js');
const port = process.env.PORT || global.gConfig.node_port;

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

console.log("Upload URL is " + global.gConfig.uploadUrl);
app.post('/upload-file', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let newFile = req.files.newFile;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            newFile.mv('./uploads/' + newFile.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: newFile.name,
                    mimetype: newFile.mimetype,
                    size: newFile.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
  });

  app.get('/download-file', async (req, res) => {
    res.download('./uploads/ovftool_commands.txt');
  });
