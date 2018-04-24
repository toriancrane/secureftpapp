var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

var ddb = new AWS.DynamoDB();

checkDynamoMatch('Stark_Wayne', '19011512-a08f-4ea8-a495-dc354a9e76bc', function(err, key) {
                                        if (err) {
                                            // handle error
                                        } else {
                                            console.log('Name of Folder: ' + key);
                                        }
                                    });


function checkDynamoMatch(folderName, subId, callback){
    
    folderName = folderName.toString();
    //console.log('Foldername: ' + folderName);
    subId = subId.toString();
    //console.log('SubId: ' + subId);
    
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
        console.log('There does not appear to be any data.');
        callback(err, null);
      } else {
          
          //console.log('the else condition', folderName)
          for(var i = 0; i < data.Item.UserId.L.length; ++i){
              var key = data.Item.UserId.L[i].S;
              console.log('SubID id:' +  subId);
              console.log('Key is: ' +  key);
              if(subId === key ){
                  //console.log('the folder name', folderName);
                  callback(err, folderName)
              }else{
                  callback(err, '');
              }
          }
          /*for(var num in data.Item.UserId.L){
              var key = JSON.stringify(data.Item.UserId.L[num].S);
              if(subId === key ){
                  console.log(folderName);
                  callback(err, folderName)
              }else{
                  callback(err, '');
              }
          }*/
      }
    });
}