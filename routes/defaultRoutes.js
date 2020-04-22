const express = require('express');
const debug = require('debug')('app:defaultRoutes');
const defaultRouter = express.Router();
const path = require("path");
const fs = require('fs').promises; // added .promises so the await would work

function router() {
  defaultRouter.route('/')
  .get((req, res) => {

    (async function getDefaultPage() {
      try {

        var fileArray = [];
        const directoryPath =  path.join(__basedir, "/uploads/");

        //passing directoryPath and callback function
        fileArray = await fs.readdir(directoryPath, function (err, files) {

          //handling error
          if (err) {
            return console.log('Unable to scan directory: ' + err);
          } else {
            // return all files in the directory
            return files;
          }
        });

        //Get vendor list for auto-complete in the form
        //const vendorList = await utilities.getVendorsList();

        //if no errors, render the index page
        res.render(
          'index',
          {
            fileArray
          }
        );

      } catch(err) {
        debug(err.stack);
      }

    }());
  });

  return defaultRouter;

};

module.exports = router;
