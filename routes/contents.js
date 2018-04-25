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
router.get('/folders/:folderName/contents', m.isAuthenticated, function(req, res, next) {
    
    var contents = [];
    //var signedUrl = [];
    var folderName = req.params.folderName;
    s3.listObjects({}, function(err, data) {
        if (err) {
            console.log(err)
        }
        if (data) {
            
            //console.log(data);
            for(var val in data.Contents){
                //To get the list of folders
                //Get the value of Key
                var fullKey = data.Contents[val].Key;
                //console.log(key);
                var key = data.Contents[val].Key;
                var fileSize = m.formatBytes(data.Contents[val].Size);
                var lastMod = data.Contents[val].LastModified;
                var folderMatch = '';
                
                //Signed URLs
                var params = {Bucket: 'mb3-demo-files', Key: fullKey};
                var url = s3.getSignedUrl('getObject', params);
                //console.log('The URL is', url);
                
                //Split at the first /10]
                folderMatch = key.split('/')[0];
                key = key.split('/')[1];
                
                //If folder on page matches folder in S3 pull, and if value of key is not empty, push to array
                if(folderName == folderMatch){
                    if(key !== '' && url !== ''){
                        
                        var fileData = {
                            "Name": key,
                            "URL": url,
                            "Size": fileSize,
                            "LastMod": lastMod
                        }
                        contents.push(fileData);
                        //contents.push(key);
                        //signedUrl.push(url);
                    }
                }

            }
            
            //Remove duplicates in array
            //contents = m.uniq(contents);
            //console.log(contents);
            
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