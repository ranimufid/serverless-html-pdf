'use strict'

const AWS_REGION = process.env.REGION;
const AWS        = require('aws-sdk')
const S3         = new AWS.S3({region: AWS_REGION});

module.exports = {
  retrieveObjectContent: (bucketName, bucketObjectName) => S3.getObject(
    {
      Bucket: bucketName,
      Key: bucketObjectName
    }
  ).promise(),

  uploadPdf: (bucketName, bucketObjectName, body, contentType) => S3.putObject(
    {
      Bucket: bucketName,
      Key: bucketObjectName,
      Body: body,
      ContentType: contentType
    }
  ).promise()
}
