#!/usr/bin/env bash
# ENV VARS
RED=`tput setaf 1`
GREEN=`tput setaf 2`
YELLOW=`tput setaf 3`
BUCKET_CREATED=false

# Get time function
function TIME {
   echo "[`date +"%T"`]"
}

# echo "${GREEN}${TIME} This script will initiate your serverless.env.yml & create s3 bucket..."
# sleep 1;
echo "${GREEN}${TIME} Have you set an AWS profile with the appropriate permissions? (eg, export AWS_PROFILE='myprofile')"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done
echo "${GREEN}${TIME}I need the following info from you:"

printf "Bucket Name: "
read -r BUCKET_NAME;
printf "AWS Account ID: "
read -r AWS_ACCOUNT_ID;
printf "Enable IOPipe? (Y/N): "
read -r IOPIPE_ENABLED;
if [ $IOPIPE_ENABLED == 'Y' ] || [ $IOPIPE_ENABLED == 'y' ]; then
  printf "Iopipe Token: ";
  read -r IOPIPE_TOKEN;
fi

echo "${GREEN}$(TIME) Creating S3 Bucket..."

# create s3 bucket
while [ $BUCKET_CREATED == "false" ]; do
  if aws s3 mb s3://$BUCKET_NAME 2>&1 | grep -q 'BucketAlreadyExists'; then
    printf "${YELLOW}$(TIME) A bucket with this name has already been created. Please enter a new name: ";
    read -r BUCKET_NAME;
  else
    echo "${GREEN}$(TIME) Bucket $BUCKET_NAME created succesfully..."
    BUCKET_CREATED=true
  fi
done
# copy serverless.env.yml.default to serverless.env.yml
echo "${GREEN}$(TIME) Configuring serverless.env.yml..."
cp serverless.env.yml.default serverless.env.yml
# populate serverless.env.yml with user inputs
if [ $IOPIPE_ENABLED == 'Y' ] || [ $IOPIPE_ENABLED == 'y' ]; then
  sed -i '' "s/iopipe_enabled.*/iopipe_enabled: true/" serverless.env.yml
  sed -i '' "s/iopipe_token.*/iopipe_token: '$IOPIPE_TOKEN'/" serverless.env.yml
else
  sed -i '' "s/iopipe_enabled.*/iopipe_enabled: false/" serverless.env.yml
fi
sed -i '' "s/aws_account_id.*/aws_account_id: '$AWS_ACCOUNT_ID'/" serverless.env.yml
sed -i '' "s/s3_bucket_name.*/s3_bucket_name: '$BUCKET_NAME'/" serverless.env.yml
# update test event with custom bucket name
echo "${GREEN}$(TIME) Customizing test event..."
cp event.json.default event.json
sed -i '' "s/{BUCKET_NAME}/$BUCKET_NAME/" event.json
# Uploading sample html to newly created bucket
echo "${GREEN}$(TIME) Uploading sample html to newly created bucket..."
aws s3 cp docs/sample_report.htm s3://$BUCKET_NAME/ > /dev/null 2>&1;

if which yarn > /dev/null 2>&1; then
  echo "${GREEN}$(TIME) Running yarn install...";
  yarn install > /dev/null 2>&1;
  echo "${GREEN}$(TIME) Project initialization completed. Please proceed to run 'yarn deploy' manually..."
else 
  echo "${YELLOW}$(TIME) Yarn doesn't seem to be installed/not in your current path. Please run 'yarn install' and `yarn deploy` manually."; echo "${GREEN}$(TIME) Project initialization completed."
fi
