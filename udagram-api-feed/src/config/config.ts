export const config = {
  "dev": {
    "username": 'postgres',
    "password": 'postgresAbc111',
    "database": 'postgres',
    "host": 'postgres.cohefwz5riff.us-east-1.rds.amazonaws.com',
    "dialect": "postgres",
    "aws_reigion": 'us-east-1',
    "aws_profile": 'serverless-admin',
    "aws_media_bucket": 'c2-udacity',
    "url": 'http://localhost:8100'    
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  },
  "jwt": {
    "secret": 'testing'
  }

}
