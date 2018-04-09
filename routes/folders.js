var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

/* GET Folders page. */
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

    //console.log('Test Info2: ' + JSON.stringify(cognitoUser));
    /*cognitoUser.getSession(function(err, session) {
        if (err) {
                console.log(err.message || JSON.stringify(err));
                return;
            }
        var idToken = session.getIdToken().getJwtToken();
        console.log(idToken);
    });*/

    if (cognitoUser != null){
        res.render('folders');
    }else{
        var user_message = "You need to be logged in to access this page."
        req.flash('info', user_message)
        res.redirect('/');
    }
});

module.exports = router;
