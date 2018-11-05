'use strict'

const wkhtmltopdf  = require('wkhtmltopdf');
const fs = require('fs');

module.exports = {
  paramGen: (sqsMessageBody) => {
    return {
      bucketName: sqsMessageBody.bucketName,
      htmlFileName: sqsMessageBody.fileName,
      outputFileName: sqsMessageBody.fileName.replace(/\.[^.]+$/, '') + Math.random().toString(36).substring(7) + ".pdf",
      htmlToPdfOptions: sqsMessageBody.options
    }
  },
  convertToPdf: (htmlUtf8, options, callback, memStream) => {
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
  }
}