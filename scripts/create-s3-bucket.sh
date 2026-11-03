#!/usr/bin/env bash
# Creates (or reuses) the AWS S3 bucket that Udagram's backend-feed service
# uses to store uploaded images, and applies the bucket policy / CORS rules
# described in Classroom_Project_Instructions/Part_0_Prerequisites_and_Getting_Started.md.
#
# Usage:
#   source set_env.sh   # populates AWS_BUCKET, AWS_REGION, AWS_PROFILE
#   ./scripts/create-s3-bucket.sh
#
# Requires: AWS CLI v2 configured with credentials that can create S3 buckets
# (e.g. `aws configure --profile "$AWS_PROFILE"` with an IAM user that has
# admin or S3 admin privileges).
set -euo pipefail

: "${AWS_BUCKET:?Set AWS_BUCKET (e.g. run: source set_env.sh) before running this script}"
: "${AWS_REGION:?Set AWS_REGION (e.g. run: source set_env.sh) before running this script}"

PROFILE_ARGS=()
if [[ -n "${AWS_PROFILE:-}" ]]; then
  PROFILE_ARGS=(--profile "$AWS_PROFILE")
fi

echo "Verifying AWS credentials..."
aws sts get-caller-identity "${PROFILE_ARGS[@]}" >/dev/null

echo "Creating S3 bucket '$AWS_BUCKET' in region '$AWS_REGION' (skipping if it already exists)..."
if aws s3api head-bucket "${PROFILE_ARGS[@]}" --bucket "$AWS_BUCKET" 2>/dev/null; then
  echo "Bucket '$AWS_BUCKET' already exists, continuing..."
elif [[ "$AWS_REGION" == "us-east-1" ]]; then
  aws s3api create-bucket "${PROFILE_ARGS[@]}" --bucket "$AWS_BUCKET" --region "$AWS_REGION"
else
  aws s3api create-bucket "${PROFILE_ARGS[@]}" --bucket "$AWS_BUCKET" --region "$AWS_REGION" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION"
fi

echo "Disabling Block Public Access so the bucket policy below can take effect..."
aws s3api put-public-access-block "${PROFILE_ARGS[@]}" --bucket "$AWS_BUCKET" \
  --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

echo "Applying a public bucket policy (matches the course's example policy)..."
POLICY=$(cat <<POLICY_EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "UdagramPublicAccess",
      "Principal": "*",
      "Action": "s3:*",
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${AWS_BUCKET}"
    },
    {
      "Sid": "UdagramPublicObjectAccess",
      "Principal": "*",
      "Action": "s3:*",
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${AWS_BUCKET}/*"
    }
  ]
}
POLICY_EOF
)
aws s3api put-bucket-policy "${PROFILE_ARGS[@]}" --bucket "$AWS_BUCKET" --policy "$POLICY"

echo "Applying CORS rules so the frontend can upload via presigned URLs..."
CORS=$(cat <<CORS_EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
CORS_EOF
)
aws s3api put-bucket-cors "${PROFILE_ARGS[@]}" --bucket "$AWS_BUCKET" --cors-configuration "$CORS"

echo
echo "Done. Bucket '$AWS_BUCKET' is ready in region '$AWS_REGION'."
echo "Reminder: once you're done testing locally, re-enable Block Public Access and/or tighten the bucket policy."
