# ⚡️ HTML to PDF conversion SQS Worker

This serverless app creates consumers and workers that process incoming messages from an SQS queue. The workers convert an HTML (in an S3 bucket) to a pdf which is finally uploaded to the same bucket. Additionally, this serverless project uses [iopipe](https://www.iopipe.com/) for lambda tracing and debugging.

## Components
- SQS Queue to hold messages
- SNS Topic to handle CloudWatch Alarms
- DynamoDB table to persist configuration
- CloudWatch Schedule as cron replacement
- Three (`scale`, `worker`, `process`) AWS Lambda functions

## Workflow

- CloudWatch Alarms triggered by changes in queue length post to SNS
- SNS Topic triggers `scale` Lambda function
- Function `scale` updates configuration in DynamoDB 
- CloudWatch Schedule invokes `consumer` every `x` minute(s)
- Function `consumer` reads configuration from DynamoDB
- Function `consumer` invokes `worker` function(s)


## Getting Started

1. _`yarn aws-init`_: script to instantiate the serverless work environment (yarn install --> create s3 bucket to store html and pdf files --> generates serverless.env.yml)
2. _`yarn deploy`_: deploys your serverless code to AWS
3. _`yarn test`_: trigger tests (optional)
4. _`sls invoke local -f worker --stage dev --path event.json`_: will convert the sample html uploaded by `yarn aws-init` to a pdf with unique file name

## Todo
1. Fix `html-pdf.spec.js` test scenario
2. Add unit tests
3. Fix issue preventing asynchronous function tracing from appearing on iopipe
