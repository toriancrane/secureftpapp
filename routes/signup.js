var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/', function(req, res) {
    var poolData = {
        UserPoolId : 'us-west-2_sFuJmXBam', // Your user pool id here
        ClientId : '7v3io0egl88bujb261ecdjiubn' // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    
    var attributeList = [];
    
    var dataName = {
        Name : 'name',
        Value : name
    };

    var dataEmail = {
        Name : 'email',
        Value : email
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

    attributeList.push(attributeEmail);
    attributeList.push(attributeName);

    userPool.signUp(email, password, attributeList, null, function(err, result){
        if (err) {
            console.log(err.message || JSON.stringify(err));
            req.flash('info', err.message)
            res.redirect('/signup');
        }
        var cognitoUser = result.user;
        var success_message = 'Registration success! Please log in.'
        console.log('user name is ' + cognitoUser.getUsername());
        req.flash('info', success_message)
        res.redirect('/');
    });
});


module.exports = router;