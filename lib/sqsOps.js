'use strict'

const AWS_REGION = process.env.REGION;
const AWS        = require('aws-sdk')
const SQS        = new AWS.SQS({region: AWS_REGION});

module.exports = {
  deleteMessage: (queueUrl,receiptHandle) => SQS.deleteMessage(
    {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle
    }
  ).promise(),

  receiveMessages: (queueUrl,maxNumMessages) => SQS.receiveMessage(
    {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: maxNumMessages
    }
  ).promise(),

  sendMessages: (queueUrl,message) => SQS.sendMessage(
    {
      QueueUrl: queueUrl,
      MessageBody: message
    }
  ).promise()
}