var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var s3ls = require('s3-ls');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;


var m = require('../modules/methods.js');

var s3 = new AWS.S3();


/* GET upload page. */
router.get('/folders/:folderName/upload', /*m.isAuthenticated, */function(req, res, next) {
    
   /* // Create a bucket and upload something into it
    var bucketName = 'mb3-demo-files';
    var fileName = 
    var keyName = folderName + "/" + fileName';
    
    s3.createBucket({Bucket: bucketName}, function() {
      var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
      s3.putObject(params, function(err, data) {
        if (err)
          console.log(err)
        else
          console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
      });
    });*/
    
    res.render('upload');

});

module.exports = router;
