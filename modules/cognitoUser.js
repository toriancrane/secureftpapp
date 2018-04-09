var getCognitoUserTest = function(){
    
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
};


var getUsername = function(){
    //Gather username and password fields
    var username = req.body.username;
};


var getPassword = function(){
    var password = req.body.password;
};


var getAuthenticationData = function(){
    var authenticationData = {
        Username : getUsername(),
        Password : getPassword()
    };
};

var getAuthenticationDetails = function(){
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
};


var getPoolData = function(){
    var poolData = {
        UserPoolId : userPoolId, // Your user pool id here
        ClientId : clientId // Your client id here
    };
};

var getCognitoUser = function(){
    var userPoolId = req.app.locals.UserPoolId;
    var clientId = req.app.locals.ClientId;
    var identityPoolId = req.app.locals.IdentityPoolId;
    
    var authenticationData = getAuthenticationData();
    var authenticationDetails = getAuthenticationDetails();
};

exports.getCognitoUser = getCognitoUser;