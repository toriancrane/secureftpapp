var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

AWS.config.update({region:'us-west-2'});

/* GET forgotpass page. */
router.get('/', function(req, res, next) {
    var userPoolId = req.app.locals.UserPoolId;
    var clientId = req.app.locals.ClientId;
    var identityPoolId = req.app.locals.IdentityPoolId;
    
    var poolData = {
        UserPoolId : userPoolId, // Your user pool id here
        ClientId : clientId // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null){
           var params = {
              GroupName: 'TestGroup', /* required */
              UserPoolId: req.app.locals.UserPoolId, /* required */
              Username: cognitoUser.getUsername() /* required */
            };
            cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
              else     console.log(data);           // successful response
            });
            res.redirect('/'); 
        }
  
  res.render('messages');
});

module.exports = router;