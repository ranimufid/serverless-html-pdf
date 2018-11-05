wrk.method                  = "POST"
wrk.body                    = "Action=SendMessage&Version=2011-10-01&MessageBody={\"bucketName\":\"html-to-pdf-files\",\"fileName\":\"darren2.htm\",\"options\":{\"pageSize\":\"A4\"}}"
wrk.headers["Content-Type"] = "application/x-www-form-urlencoded"
-- wrk -c1 -d1 -t1 \
--     -s helpers/wrk.lua \
--     https://sqs.eu-central-1.amazonaws.com/586116331281/dev-html-to-pdf-serverless-messages