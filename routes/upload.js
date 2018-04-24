var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var path = require('path');
var Busboy = require('busboy');

var AWS = require('aws-sdk');
var s3ls = require('s3-ls');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;


var m = require('../modules/methods.js');

var s3 = new AWS.S3();


/* GET upload page. */
router.get('/folders/:folderName/upload', m.isAuthenticated, function(req, res, next) {
    
    res.render('upload');

});


/*router.post('/folders/:folderName/upload', function(req, res) {
  var folderName = req.params.folderName;
  req.pipe(req.busboy);

  req.busboy.on('file', (fieldname, file, filename) => {
    console.log("Uploading: " + filename);
    console.log("file: ", file);

    var params = {
      Bucket: 'mb3-demo-files',
      Key: folderName + '/' + filename,
      Body: file
    };

    s3.upload (params, function (err, data) {
      if (err) {
        console.log("Error: ", err);
      } if (data) {
        console.log("Upload Success: ", data.Location);
        var success_message = 'You have successfully uploaded your file!'
        req.flash('info', success_message)
        res.redirect('/folders/'+ folderName + '/contents');
      }
    });

  });

  
  // call S3 to retrieve upload file to specified bucket
  var uploadParams = {Bucket: 'mb3-demo-files', Key: '', Body: ''};
  var file = fileName;
  var fileStream = fs.createReadStream(file);
  fileStream.on('error', function(err) {
    console.log('File Error: ', err);
  });
  uploadParams.Body = fileStream;
  uploadParams.Key = folderName + '/' + fileName;
  
  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    } if (data) {
      console.log("Upload Success: ", data.Location);
      var success_message = 'You have successfully uploaded your file!'
      req.flash('info', success_message)
      res.redirect('/folders/'+ folderName + '/contents');
    }
  });
  

});*/

module.exports = router;