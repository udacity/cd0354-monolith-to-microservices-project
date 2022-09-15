export const config = {
  'username': 'postgres',
  'password': 'postgres',
  'database': 'postgres',
  'host': 'database-1.cpz8hh4xihsr.us-east-1.rds.amazonaws.com',
  'dialect': 'postgres',
  'aws_region': 'us-east-1',
  'aws_profile': 'default',
  'aws_media_bucket': 'tesr-7888585581-dev',
  'url': 'https://localhost:8100',
  'jwt': {
    'secret': process.env.JWT_SECRET,
  },
};
