'use strict';
const AWS = require ('aws-sdk');
AWS.config.update({region: 'us-east-1'});

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getDays = async (event, context) => {
  const ddb = new AWS.DynamoDB();
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});

  const params = {
    TableName: "rcfCalendar",
    FilterExpression : 'currentDay = :requestedDay',
    ExpressionAttributeValues : {':requestedDay' : event.pathParameters.day}
  }

  console.log(`Get days: Event: ${event}`)

  try {
    const data = await documentClient.scan(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(
        {data: data.Items}
      )
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: 'Error',
          error: err
        }
      )
    };
  }
};

module.exports.newSlot = async (event, context) => {
  const ddb = new AWS.DynamoDB();
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  const body = JSON.parse(event.body);
  console.log(`Body~~~ : ${body} and id: ${body.id}`);

  const params = {
    TableName: "rcfCalendar",
    Item: {
      id: body.id,
      currentDay: body.currentDay,
      beginningTime: body.beginningTime,
      lengthOfTime: body.lengthOfTime
    }
  };
  console.log(`Event Params: ${event.body}`);
  

  try {
    const data = await documentClient.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(
        {data: body}
      )
    };
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
