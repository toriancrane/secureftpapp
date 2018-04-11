var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var s3ls = require('s3-ls');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;


var m = require('../modules/methods.js');
var s3 = new AWS.S3({
        region: 'us-west-2',
        params: {
            Bucket: 'mb3-demo-files'
        }
    });

/* GET contents page. */
router.get('/folders/:folderName/contents',/* m.isAuthenticated,*/ function(req, res, next) {
    
    var contents = [];
    var folderName = req.params.folderName;
    s3.listObjects({}, function(err, data) {
        if (err) {
            console.log(err)
        }
        if (data) {
            
            for(var val in data.Contents){
                //To get the list of folders
                //Get the value of Key
                var key = data.Contents[val].Key;
                var folderMatch = '';
                
                //Split at the first /10]
                folderMatch = key.split('/')[0];
                key = key.split('/')[1];
                
                //If folder on page matches folder in S3 pull, and if value of key is not empty, push to array
                if(folderName == folderMatch){
                    if(key !== ''){
                        contents.push(key);
                    }
                }

            }
            
            //Remove duplicates in array
            //contents = m.uniq(contents);
            console.log(contents);
            
            //Return the array
            res.render('contents', {
                contents: contents,
                folderName: folderName
            });
        }
    });
    
    
    /*var lister = s3ls({bucket: 'mb3-demo-files'});
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
    .catch(console.error);*/

});

module.exports = router;