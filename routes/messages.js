var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

/* GET forgotpass page. */
router.get('/', function(req, res, next) {
  res.render('messages');
});

module.exports = router;