var TASK_QUEUE_URL = 'https://sqs.' + process.env.REGION + '.amazonaws.com/' + process.env.AWS_ACCOUNT_ID + '/' + process.env.SQS_QUEUE
var DLQ_QUEUE_URL = 'https://sqs.' + process.env.REGION + '.amazonaws.com/' + process.env.AWS_ACCOUNT_ID + '/' + process.env.DLQ_SQS_QUEUE
const DEFAULT_FILTER = /\.html?$/; // essentially: *.htm, *.html
const DEFAULT_PAGESIZE = 'letter';
const PDF_CONTENTTYPE = 'application/pdf';
const wkhtmltopdf  = require('wkhtmltopdf');
const MemoryStream   = require('memorystream');
const s3Ops = require('../lib/s3Ops.js')
const sqsOps = require('../lib/sqsOps.js')
const utils = require('../lib/utils.js')

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function convertToPdf (htmlUtf8, options, callback) {
  return new Promise(function(resolve, reject){
    wkhtmltopdf(htmlUtf8, options, function(err, pdf) {
       if (err){
          reject(err)
        }
        else {
          resolve(pdf);
          return(pdf)
        }
    }).pipe(memStream);
  })
};

async function pdfGenerationFlow(context,bucket,key,htmlToPdfOptions,output_filename) {
  let memStream = new MemoryStream();
  const mark = context.iopipe.mark;
  mark.start('s3-html-retrieval');
  const htmlContent=await s3Ops.retrieveObjectContent(bucket, key);
  mark.end('s3-html-retrieval');
  mark.start('html-pdf-conversion');
  const convertedPdf=await utils.convertToPdf(htmlContent.Body.toString('utf-8'),htmlToPdfOptions,output_filename,memStream);
  mark.end('html-pdf-conversion');
  mark.start('upload-pdf');
  const uploadPdf=await s3Ops.uploadPdf(bucket,output_filename,memStream.read(),PDF_CONTENTTYPE);
  mark.end('upload-pdf');
  memStream.end();
  console.log("PDF Uploaded Succesfully");
}

exports.handler = async (event, context, callback) => {
  var sqsItems=await sqsOps.receiveMessages(TASK_QUEUE_URL,10);
  var sqsMessages=sqsItems.Messages;

  if (sqsItems && sqsItems.Messages) {
    try {
      await asyncForEach(sqsItems.Messages, async (message) => {
      if (context.getRemainingTimeInMillis() > 10000){
        //mark.start('input-parsing-validation');
        reqParams=utils.paramGen(JSON.parse(decodeURIComponent(message.Body.replace(/\+/g, " "))));
        //mark.end('input-parsing-validation');
        console.log("reqParams: >>>" +  JSON.stringify(reqParams));

        (async () => {
          Promise.all([pdfGenerationFlow(context,reqParams.bucketName,reqParams.htmlFileName,reqParams.htmlToPdfOptions,reqParams.outputFileName)])
          .then(sqsOps.deleteMessage(TASK_QUEUE_URL,message.ReceiptHandle))
          .catch( error => console.log(error.message));
        })()
      }
    })
    } catch (err) {
      console.log("Something went wrong: " + err);
    }

  } 
  //below logic allows lambda to bested by passing an sqs message as event input to handler
  else if (event){
    reqParams=utils.paramGen(JSON.parse(decodeURIComponent(event.Body.replace(/\+/g, " "))));
      console.log("reqParams: >>>" +  JSON.stringify(reqParams));
      (async () => {
        Promise.all([pdfGenerationFlow(context,reqParams.bucketName,reqParams.htmlFileName,reqParams.htmlToPdfOptions,reqParams.outputFileName)])
        .catch( error => console.log(error.message));
      })()
  }
  else {
    callback(null, 'No SQS messages to process, exiting...');
  }

  callback(null, 'Success');
};
