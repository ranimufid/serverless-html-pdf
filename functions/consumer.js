'use strict'

const AWS          = require('aws-sdk')
const LAMBDA       = new AWS.Lambda({apiVersion: '2015-03-31'})
var AWS_REGION     = process.env.REGION;
var sqs            = new AWS.SQS({region: AWS_REGION});
var TASK_QUEUE_URL = 'https://sqs.' + AWS_REGION + '.amazonaws.com/' + process.env.AWS_ACCOUNT_ID + '/' + process.env.SQS_QUEUE

const scale = require('../lib/scale.js')

function receiveSQSAttributes(callback) {
  var params = {
    QueueUrl: TASK_QUEUE_URL,
    // MaxNumberOfMessages: 10
    AttributeNames: ['ApproximateNumberOfMessages']
  };
  return sqs.getQueueAttributes(params).promise();
}

module.exports.handler = async function (event, context, callback) {
  // initiate iopipe trace marking
  const mark = context.iopipe.mark;
  // retrieve SQS messages from queue
  mark.start('get-sqs-attributes');
  var sqsMessageAttributes=await receiveSQSAttributes();
  var sqsMessageCount=sqsMessageAttributes.Attributes.ApproximateNumberOfMessages;
  mark.end('get-sqs-attributes');
  console.log("current SQS messages: " + sqsMessageCount);

  if (sqsMessageCount > 0) {
    mark.start('invoke-worker-lambdas')
    scale.get().then(
      count => Array.apply(null, Array(count)).map(
        (_, index) => LAMBDA.invoke(
          {
            FunctionName: process.env.worker,
            InvocationType: 'Event',
            LogType: 'None'
          },
          () => {
            console.log('started', index + 1)
          }
        )
      ).length
    ).then(
      count => ({ count })
    ).then(
      console.log
    ).then(
      mark.end('invoke-worker-lambdas')
    ).then(
      callback
    )
  }
  else {
    console.log('DONE');
    callback(null, 'DONE');
  }
}