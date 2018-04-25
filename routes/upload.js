var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer'), // "multer": "^1.1.0"
    multerS3 = require('multer-s3'); //"^1.4.1"

var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;


var m = require('../modules/methods.js');

var s3 = new AWS.S3();
app.use(bodyParser.json());

var bucketName = 'mb3-demo-files';
var folderName = '';
var owner = '';

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
          cb(null, {uploadedBy: owner});
        },
        key: function (req, file, cb) {
            console.log(file);
            cb(null, folderName + '/' + file.originalname);
        }
    })
});


/* GET upload page. */
router.get('/folders/:folderName/upload', m.isAuthenticated, function(req, res, next) {
    folderName = req.params.folderName;
    //console.log(folderName);
    res.render('upload');

});


router.post('/folders/:folderName/upload', upload.array('fileName', 1), function(req, res, next) {
    folderName = req.params.folderName;
    var userPoolId = req.app.locals.UserPoolId;
    var clientId = req.app.locals.ClientId;
    var identityPoolId = req.app.locals.IdentityPoolId;
    
    var poolData = {
        UserPoolId : userPoolId, // Your user pool id here
        ClientId : clientId // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    
    if (cognitoUser != null) {
          cognitoUser.getSession(function(err, session){
              if(err){
                    console.log(err);
                    return;
                }
                owner = session.getIdToken().payload['name'];
                var success_message = 'You have successfully uploaded your file!'
                req.flash('info', success_message)
                res.redirect('/folders/'+ folderName + '/contents');
          });
        }

});

module.exports = router;