var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var s3ls = require('s3-ls');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;


var m = require('../modules/methods.js');

var s3 = new AWS.S3();


/* GET contents page. */
router.get('/folders/:folderName/contents', /*m.isAuthenticated,*/ function(req, res, next) {
    
    var lister = s3ls({bucket: 'mb3-demo-files'});
    //var s3Folders = [];
    var contents = [];
    lister.ls('/' + req.params.folderName)
    .then((data) => {
        console.log(data.files); //
        for(var i in data.files){
            var val = data.files[i];
            val = val.split("/")[1];
            contents.push(val);
        };
        res.render('contents', {contents: contents});
    })
    .catch(console.error);

});

module.exports = router;