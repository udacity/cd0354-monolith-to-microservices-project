
require('dotenv').config();

export const config = {
  'username': process.env.POSTGRES_USERNAME,
  'password': process.env.POSTGRES_PASSWORD,
  'database': process.env.POSTGRES_DB,
  'host': process.env.POSTGRES_HOST,
  'dialect': 'postgres',
  'aws_region': process.env.AWS_REGION,
  'aws_profile': process.env.AWS_PROFILE,
  'aws_media_bucket': process.env.AWS_BUCKET,
  'url': process.env.URL,
  'jwt': {
    'secret': process.env.JWT_SECRET,
  },
  'aws_access_key': process.env.AWS_ACCESS_KEY,
  'aws_secret_key': process.env.AWS_SECRET_KEY,
  'aws_session_token': process.env.AWS_SESSION_TOKEN,
};
