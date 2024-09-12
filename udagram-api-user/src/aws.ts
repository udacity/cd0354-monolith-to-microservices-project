import AWS = require("aws-sdk");
import { config } from "./config/config";

// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({
  profile: config.aws_profile,
});
AWS.config.credentials = credentials;

export const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: config.aws_region,
  params: { Bucket: config.aws_media_bucket },
});

const bucketName = config.aws_media_bucket;

s3.headBucket({ Bucket: bucketName }, function (err, data) {
  if (err && err.code === "NotFound") {
    console.log("Bucket does not exist");
  } else if (err) {
    console.log("Error:", err.code);
  } else {
    console.log("Bucket exists and is accessible");
  }
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;
  return s3.getSignedUrl("getObject", {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;

  const s = s3.getSignedUrl("putObject", {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
  console.log(s);
  return s;
}
