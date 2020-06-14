const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.getDays = function(e, ctx, callback) {
    let params = {
        TableName: 'calendar',
        Limit: 100,
        Key: {
            "date": "05-20-2020"
        }
    };
    documentClient.scan(params, function(err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
