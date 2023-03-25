import AWS = require('aws-sdk');
import {config} from './config/config';


// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: config.aws_profile});
AWS.config.credentials = credentials;

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: {Bucket: config.aws_media_bucket},
});

// export const s3 = new AWS.S3({
//   accessKeyId: 'AKIARYIAZ7A6GOIMN6OY',
//   secretAccessKey: '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',
//   signatureVersion: 'v4',
//   region: 'us-east-1'
// });

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;
  console.log('config.aws_media_bucket 1', config.aws_media_bucket);

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;
  console.log('config.aws_media_bucket 2', config.aws_media_bucket);
  console.log('## credentials', credentials);
  return s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
