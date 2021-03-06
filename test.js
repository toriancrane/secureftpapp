router.get('/', m.isAuthenticated, function(req, res, next) {
    var userPoolId = req.app.locals.UserPoolId;
    var clientId = req.app.locals.ClientId;
    var identityPoolId = req.app.locals.IdentityPoolId;
    
    var poolData = {
        UserPoolId : userPoolId, // Your user pool id here
        ClientId : clientId // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    
    try{
        if (cognitoUser != null){
            cognitoUser.getSession(function(err, session){
                if(err){
                    console.log(err);
                    return;
                }
                
                //console.log('Session validity: ' + session.isValid());
                //console.log('Session token ' + session.getIdToken().getJwtToken());
                
                AWS.config.region = 'us-west-2';

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId : identityPoolId, // your identity pool id here
                    Logins : {
                        // Change the key below according to the specific region your user pool is in.
                        'cognito-idp.us-west-2.amazonaws.com/us-west-2_sFuJmXBam' : session.getIdToken().getJwtToken()
                    }
                });
                
                AWS.config.credentials.get(function(err) {
                    if (!err) {
                      var id = AWS.config.credentials.identityId;
                      console.log('Cognito Identity ID '+ id);
                      
                      // Instantiate aws sdk service objects now that the credentials have been updated
                      var s3 = new AWS.S3({
                            region: AWS.config.region,
                            params: {
                                Bucket: 'mb3-demo-files'
                            }
                        });
                        var folders = [];
                        s3.listObjects({}, function(err, data) {
                            if (err) {
                                console.log(err)
                            }
                            if (data) {
                                //console.log(data);
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
                    }
                });
                
            })
        }
    } catch (e) {
      console.log(e);
      return;
    }
    
    
    
    
    
    
    
    
    
    
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


Allow list of all buckets
Limit access to specific folders within that bucket
name the initial folder the role id and then limit access based on that id
aws iam get-role --role-name ROLE-NAME

Get role id(s) of current user, 
use that variable(s) as the delimiter in the listbucket request?


Use DynamoDB to filter folders? Make a User table and an Item table
User table will have username and folder access
Pull folder access values for logged in user
Compare folder value to each "folder" returned from ListObjects
If it matches, push the folder to the folders array

//Iterate through roles (in case of multiples), retrieve role ID, and save to array
                      //For each role ID in array, compare to folder name
                      //If roleID and folder name match, then push to folders array
                      
                      
                      console.log("Group Info :" + session.getIdToken().payload['cognito:roles']);



{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:ListBucket"
            ],
            "Condition": {
                "StringEquals": {
                    "s3:delimiter": ["/"],
                    "s3:prefix": ["","BUCKET_PATH/"]
                }
            },
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::BUCKET_NAME"
            ]
        },
        {
            "Action": [
                "s3:ListBucket"
            ],
            "Condition": {
                "StringLike": {
                    "s3:prefix": ["BUCKET_PATH/BUCKET_SUB_PATH/*"]
                }
            },
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::BUCKET_NAME"
            ]
        },
        {
            "Action": [
                "s3:DeleteObject",
                "s3:PutObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::BUCKET_NAME/BUCKET_PATH/BUCKET_SUB_PATH/*"
            ]
        }
    ]
}