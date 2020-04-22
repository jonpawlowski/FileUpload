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

// use ejs as viewing engine
app.set('views', './views/pages');
app.set('view engine', 'ejs');

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, '/')));

const defaultRouter = require('./routes/defaultRoutes')();
//const actionRouter = require('./routes/actionRoutes')();

app.use('/', defaultRouter);
//app.use('/charges', chargeRouter);

//start app
global.__basedir = __dirname;
const config = require('./config/config.js');
const port = process.env.PORT || global.gConfig.node_port;

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);

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
  downloadFile = './uploads/' + req.query.file;
  res.download(downloadFile);
  console.log("file to download is " + req.query.file);
  //res.redirect('/');
});
