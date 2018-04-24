var express = require('express');
var app = express();
var router = express.Router();

var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

AWS.config.update({region: 'us-west-2'});

var ddb = new AWS.DynamoDB();

function isAuthenticated(req, res, next){
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
        return next();
    }else{
        var user_message = "You need to be logged in to access this page."
        req.flash('info', user_message)
        res.redirect('/');
    }
}


function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function checkDynamoMatch(folderName, subId, callback){
    
    folderName = folderName.toString();
    subId = subId.toString();
    
    var params = {
      AttributesToGet: [
          "UserId"
        ],
      TableName: 'FolderAccess',
      Key: {
        'FolderName' : {S: folderName},
      }
    };
    
    // Call DynamoDB to read the item from the table
    ddb.getItem(params, function(err, data) {
      if (err) {
        callback(err, null);
      } else {
          for(var num in data.Item.UserId.L){
              var key = JSON.stringify(data.Item.UserId.L[num].S);
              if(subId === key ){
                  //console.log('They are a match!' + '\n' + folderName + '\n');
                  callback(err, folderName)
              }else{
                  callback(err, '');
              }
          }
      }
    });
}

exports.isAuthenticated = isAuthenticated;
exports.uniq = uniq;
exports.checkDynamoMatch = checkDynamoMatch;