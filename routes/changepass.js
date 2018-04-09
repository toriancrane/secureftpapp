var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var message = "";


/* GET ChangePass page. */
router.get('/', function(req, res, next) {
    res.render('changepass');
});

router.post('/', function(req, res) {
    //Gather username and password fields
    var username = req.body.username;
    var password = req.body.temp_password;
    var userPoolId = req.app.locals.UserPoolId;
    var clientId = req.app.locals.ClientId;
    var identityPoolId = req.app.locals.IdentityPoolId;
    
    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var poolData = {
        UserPoolId : userPoolId, // Your user pool id here
        ClientId : clientId // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    req.session.cognitoUser = cognitoUser;
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {

            //POTENTIAL: Region needs to be set if not already set previously elsewhere.
            AWS.config.region = 'us-west-2';
            

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : identityPoolId, // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.us-west-2.amazonaws.com/us-west-2_sFuJmXBam' : result.getIdToken().getJwtToken()
                }
            });

            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh((error) => {
                if (error) {
                     console.error(error);
                } else {
                     // Instantiate aws sdk service objects now that the credentials have been updated.
                     // example: var s3 = new AWS.S3();
                     console.log('Successfully logged!');
                     res.redirect('/folders');
                }
            });
        },
        
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            delete userAttributes.email_verified;
            var newpass = req.body.new_password;
            cognitoUser.completeNewPasswordChallenge(newpass, userAttributes);
            var msg = "You have successfully changed your password! Please log in."
            req.flash('info', msg)
            res.redirect('/');
        },

        onFailure: function(err) {
            console.log(err);
            console.log(new Error().stack);
            req.flash('info', err.message)
            res.redirect('/changepass');
        },

    });
});

module.exports = router;