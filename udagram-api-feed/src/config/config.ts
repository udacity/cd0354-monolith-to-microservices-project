// export const config = {
//   "dev": {
//     "username": 'postgres',
//     "password": 'postgresAbc111',
//     "database": 'postgres',
//     "host": 'postgres.cohefwz5riff.us-east-1.rds.amazonaws.com',
//     "dialect": "postgres",
//     "aws_reigion": 'us-east-1',
//     "aws_profile": 'serverless-admin',
//     "aws_media_bucket": 'c2-udacity',
//     "url": 'http://localhost:8100'    
//   },
//   "prod": {
//     "username": "",
//     "password": "",
//     "database": "udagram_prod",
//     "host": "",
//     "dialect": "postgres"
//   },
//   "jwt": {
//     "secret": 'testing'
//   }

// }
export const config = {
  "dev": {
    "username": process.env.POSTGRESS_USERNAME,
    "password": process.env.POSTGRESS_PASSWORD,
    "database": process.env.POSTGRESS_DB,
    "host": process.env.POSTGRESS_HOST,
    "dialect": "postgres",
    "aws_reigion": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE,
    "aws_media_bucket": process.env.AWS_BUCKET,
    "url": process.env.URL    
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  },
  "jwt": {
    "secret": process.env.JWT_SECRET
  }

}