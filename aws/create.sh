aws cloudformation create-stack --stack-name $1 --template-body file://$2  --parameters file://$3 --capabilities "CAPABILITY_IAM" "CAPABILITY_NAMED_IAM" --region=ap-southeast-1 --profile udacity
aws cloudformation wait stack-create-complete \
    --stack-name $1 --profile udacity
