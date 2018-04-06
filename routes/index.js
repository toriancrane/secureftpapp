var express = require('express');
var router = express.Router();

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SecureFTP' });
});


//Grab the request body
router.post('/', function(req, res){
    //Store request body in a variable
    var body = req.body;
    var res_body = {
        username: body.username,
        password: body.password
    };
    
    res.render('folders', res_body);
});

module.exports = router;
