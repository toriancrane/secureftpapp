var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var s3ls = require('s3-ls');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;


var m = require('../modules/methods.js');

var s3 = new AWS.S3();


/* GET Folders page. */
router.get('/', /*m.isAuthenticated,*/ function(req, res, next) {
    
    var lister = s3ls({bucket: 'mb3-demo-files'});
    var s3Folders = [];
    lister.ls('')
    .then((data) => {
        for(var i in data.folders){
            var val = data.folders[i];
            val = val.replace('/','');
            s3Folders.push(val);
        };
        
        res.render('folders', {folders: s3Folders});
    })
    .catch(console.error);
    
    

});

module.exports = router;
