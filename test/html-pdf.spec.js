'use strict'

const worker = require('../functions/worker.js')
const utils = require('../lib/utils.js')

const context = {
  "awsRequestId": "id",
  "functionName": "dev-html-to-pdf-serverless-worker",
  "functionVersion": "HEAD",
  "invokeid": "id",
  "iopipe": {
    "config": {},
    "mark": {},
    "version": "1.12.0"
  },
  "isDefaultFunctionVersion": true,
  "logGroupName": "/aws/lambda/dev-html-to-pdf-serverless-worker",
  "logStreamName": "abc123",
  "memoryLimitInMB": "1024"
}

const sampleEvent = {
    "MessageId": "46f6f2a0-49f2-4852-afe1-d766f7293534",
    "ReceiptHandle": "AQEB0ANpkmYWuzL/tqM5sMCl3951Wg82SgM+VpqOzXcPLuB+VC+O18hnWHfJU2PRIPWGC0PbzCGN4iGaUxtusAzIBpFEZXkVjzCrNXhPSewxYEUHdcMaI1lrdpeRt7xWVirCgQSoqfLLuAkigLuLATtC1sys8d+F9cJB72Xxc6o05R1vCkYKSIfpmBeo24luddZgcPU6iwCM6yzyphn8GFmNIlhMv+RkY1VQhSOKYKLaWpo0d6YJxa+m/o0MrDA0oCpiGpUBibXKA88jsTkwSM/dEeT5+KVzYSpW2PwdZQd3c/ndCFeTFyHSztBERD+ffO6NUcS5qQMVY+/m4pzZJw5ZBs3/D+pW5vxEn1r/uZX4G0ybQJDKeSoRXttcrM9hYTDQ/oeQ7/PhhSdwmu4vJrkvLwoXvIBFwpiEcNVDnQGD96Q=",
    "MD5OfBody": "1d13a77bb453eb62e1e3e864b2f0b010",
    "Body": "{\"bucketName\":\"dummy-buckets\",\"fileName\":\"sample_report.htm\",\"options\":{\"pageSize\":\"A4\"}}"
  }

// it('should generate and upload pdf to s3', () => {
// 	expect(worker.testFunc(context,sampleEvent)).toBe('PDF Uploaded Succesfully')
// })

test('should generate and upload pdf to s3', async () => {
  let reqParams=utils.paramGen(JSON.parse(decodeURIComponent(sampleEvent.Body.replace(/\+/g, " "))));
  (async () => {
    Promise.all([worker.pdfGenerationFlow(context,reqParams.bucketName,reqParams.htmlFileName,reqParams.htmlToPdfOptions,reqParams.outputFileName)])
    .catch( error => console.log(error.message));
  })()
  // expect.assertions(1);
  // const data = await worker.testFunc(sampleEvent);
  // expect(data).toBe('PDF Uploaded Succesfully');
});

// test('the fetch fails with an error', async () => {
//   expect.assertions(1);
//   try {
//     await fetchData();
//   } catch (e) {
//     expect(e).toMatch('error');
//   }
// });