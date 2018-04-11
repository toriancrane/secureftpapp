var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var uuid = require('node-uuid');
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


/* GET Folders page. */
router.get('/'/*, m.isAuthenticated*/, function(req, res, next) {
    var folders = [];
    s3.listObjects({}, function(err, data) {
        if (err) {
            console.log(err)
        }
        if (data) {
            console.log(data);
            for(var val in data.Contents){
                //To get the list of folders
                //Get the value of Key
                var key = data.Contents[val].Key;
                
                
                //Split at the first /[0] 
                key = key.split('/')[0];
                
                //Push to array
                folders.push(key);
                
                //To get the list of file names
                
                //Split at the first /[1]
                
                //Push to array
                //console.log(val + ": " + data.Contents[val].Key + '\n')
            }
            
            //Remove duplicates in array
            folders = m.uniq(folders);
            //console.log(folders);
            
            //Return the array
            res.render('folders', {folders: folders});
        }
    });
    
    
    
    
    
    /*var lister = s3ls({bucket: 'mb3-demo-files'});
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
    .catch(console.error);*/
    
    //res.render('folders');

});

module.exports = router;
