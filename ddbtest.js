var AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var params = {
  AttributesToGet: [
      "UserId"
    ],
  TableName: 'FolderAccess',
  Key: {
    'FolderName' : {S: 'Stark_Wayne'},
  }
};

// Call DynamoDB to read the item from the table
ddb.getItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
      for(var val in data.Item.UserId.L){
          console.log(JSON.stringify(data.Item.UserId.L[val].S));
      }
  }
});