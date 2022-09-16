# Overview - Udagram Image Filtering Microservice
The project application, **Udagram** - an Image Filtering application, allows users to register and log into a web client, and post photos to a feed.

This section introduces the project followed by instructions on how to set up your local environment remote dependencies to be able to configure and run the starter project.

## Components
At a high level, the project has 2 main components:
1. Frontend Web App - Angular web application built with Ionic Framework
2. Backend RESTful API - Node-Express application

## Project Goal
In this project you will:
- Refactor the monolith application to microservices
- Set up each microservice to be run in its own Docker container
- Set up a Travis CI pipeline to push images to DockerHub
- Deploy the DockerHub images to the Kubernetes cluster

# Local Prerequisites
You should have the following tools installed in your local machine:
* Git
* Node.js
* PostgreSQL client
* Ionic CLI
* Docker
* AWS CLI
* kubectl

We will provide some details and tips on how to set up the mentioned prerequisites. In general, we will opt to defer you to official installation instructions as these can change over time.

## Git
Git is used to interface with GitHub. 

> Windows users: Once you download and install Git for Windows, you can execute all the bash, ssh, git commands in the Gitbash terminal. On the other hand, Windows users using Windows Subsystem for Linux (WSL) can follow all steps as if they are Linux users.

### Instructions
Install [Git](https://git-scm.com/downloads) for your corresponding operating system.

## Node.js
### Instructions
Install Node.js using [these instructions](https://nodejs.org/en/download/). We recommend a version between 12.14 and 14.15.

This installer will install Node.js as well as NPM on your system. Node.js is used to run JavaScript-based applications and NPM is a package manager used to handle dependencies.

### Verify Installation
```bash
# v12.14 or greater up to v14.15
node -v
```

```bash
# v7.19 or greater
npm -v
```

## PostgreSQL client
Using PostgreSQL involves a server and a client. The server hosts the database while the client interfaces with it to execute queries. Because we will be creating our server on AWS, we will only need to install a client for our local setup.

### Instructions
The easiest way to set this up is with the [PostgreSQL Installer](https://www.postgresql.org/download/). This installer installs a PostgreSQL client in the form of the `psql` command line utility.

## Ionic CLI
Ionic Framework is used to make cross-platform applications using JavaScript. It is used to help build and run Udagram.

### Instructions
Use [these instructions](https://ionicframework.com/docs/installation/cli) to install Ionic Framework with `npm`.

#### Verify Installation
```bash
# v6.0 or higher
ionic --version
```

## Docker
Docker is needed to build and run containerized applications.

### Instructions
Follow the instructions for [Docker Desktop](https://docs.docker.com/desktop/#download-and-install) to install Docker.

## AWS CLI
We use AWS CLI to interface programmatically with AWS.

### Instructions
Follow [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) to set up AWS CLI.

After it's installed, you will need to configure an AWS access profile locally so that our local environment knows how to access your AWS account:
1. Create an IAM user with admin privileges on the AWS web console. Copy its Access Key.
2. Configure the access profile locally using your Access Key:
```bash
aws configure [--profile nd9990]
```

### Verify Installation
```bash
# aws-cli/2.0.0 or greater
aws --version
```

## kubectl
kubectl is the command line tool to interface with Kubernetes. We will be using this to communicate with the EKS cluster that we create in AWS.

### Instructions
Follow the [instructions here](https://kubernetes.io/docs/tasks/tools/#kubectl).

# Project Prerequisites
To run this project, you are expected to have:
1. An S3 bucket
2. A PostgreSQL database

## S3 Bucket
The project uses an AWS S3 bucket to store image files.

### Instructions
1. Navigate to S3 from the AWS console.
2. Create a public S3 bucket with default configurations (eg. no versioning, disable encryption).
3. In your newly-created S3 bucket, go to the **Permissions** tab and add an additional bucket policy to enable access for other AWS services (ie. Kubernetes).

   You can use the <a href="https://awspolicygen.s3.amazonaws.com/policygen.html" target="_blank">policy generator</a> tool to generate such an IAM policy. See an example below (change the bucket name in your case).
   ```json
   {
   "Version":"2012-10-17",
   "Statement":[
         {
            "Sid":"Stmt1625306057759",
            "Principal":"*",
            "Action":"s3:*",
            "Effect":"Allow",
            "Resource":"arn:aws:s3:::test-nd9990-dev-wc"
         }
      ]
   }
   ```

   > In the AWS S3 console, the CORS configuration must be JSON format. Whereas, the AWS CLI can use either JSON or XML format.

   > Once the policies above are set and you are no longer testing locally, you can disable public access to your bucket.

## PostgreSQL Database
We will create a PostgreSQL database using AWS RDS. This is used by the project to store user metadata.

### Instructions
1. Navigate to RDS from the AWS console.
2. Create a PostgreSQL database with the following configurations:

   <center>

   |**Field**|**Value**|
   |---|---|
   |Database Creation Method|Standard create |
   |Engine Option|PostgreSQL 12 or greater|
   |Templates |Free tier <small>(if no Free tier is available, select a different PostgreSQL version)</small>|
   |DB Instance Identifier|Your choice|
   |Master Username|Your choice|
   |Password|Your choice|
   |DB Instance Class|Burstable classes with minimal size |
   |VPC and Subnet |Default|
   |Public Access|Yes|
   |Database Authentication|Password authentication|
   |VPC security group|Either choose default or <br>create a new one|
   |Availability Zone|No preferencce|
   |Database port|`5432` (default)|
   </center>

2. Once the database is created successfully (this will take a few minutes), copy and save the database endpoint, master username, and password to your local machine. These values are required for the application to connect to the database.

3. Edit the security group's inbound rule to allow incoming connections from anywhere (`0.0.0.0/0`). This will allow an application that is running locally to connect to the database. 

> Note: AWS RDS will automatically create a database with the name `postgres` if none is configured during the creation step. By following the setup instructions provided here, we will be using the default database name.

### Verify Connection
Test the connection from your local PostgreSQL client.
Assuming the endpoint is: `mypostgres-database-1.c5szli4s4qq9.us-east-1.rds.amazonaws.com`, you can run:
```bash
psql -h mypostgres-database-1.c5szli4s4qq9.us-east-1.rds.amazonaws.com -U [your-username] postgres
# Provide the database password when prompted
```
If your connection is succesful, your terminal should print ` "postgres=>"`.

You can play around with some `psql` commands found [here](https://www.postgresql.org/docs/13/app-psql.html).

Afterwards, you can enter `\q` to quit.

# Project Configuration
Once the local and remote prerequisites are set up, we will need to configure our application so that they can connect and utilize them.

## Fork and Clone the Project
If you have not already done so, you will need to fork and clone the project so that you have your own copy to work with.

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/nd9990-c3-microservices-exercises.git

cd nd9990-c3-microservices-exercises/project/
```

## Configuration Values
The application will need to connect to the AWS PostgreSQL database and S3 bucket that you have created.

We do **not** want to hard-code the configuration details into the application code. The code should not contain sensitive information (ie. username and password).

For this reason, we will follow a common pattern to store our credentials inside environment variables. We'll explain how to set these values in Mac/Linux environments and Windows environments followed by an example.

### Set Environment Variables in Mac/Linux
#### Instructions
1. Use the `set_env.sh` file present in the `project/` directory to configure these values on your local machine. This is a file that has been set up for your convenience to manage your environment.
2. Prevent this file from being tracked in `git` so that your credentials don't become stored remotely:
   ```bash
   # Stop git from tracking the set_env.sh file
   git rm --cached set_env.sh

   # Prevent git from tracking the set_env.sh file
   echo *set_env.sh >> .gitignore
   ```
3. Running the command `source set_env.sh` will set your environment variables.
     > Note: The method above will set the environment variables temporarily. Every time you open a new terminal, you will have to run `source set_env.sh` to reconfigure your environment variables
#### Verify Configurations
1. Set the configuration values as environment variables:
```bash
source set_env.sh
```
2. Verify that environment variables were set by testing one of the expected values:
```bash
echo $POSTGRES_USERNAME
```

### Set Environment Variables in Windows
Set all the environment variables as shown in the `set_env.sh` file either using the **Advanced System Settings** or d GitBash/WSL terminal.

Below is an example. Make sure that you replace the values with ones that are applicable to the resources that you created in AWS.
```bash
setx POSTGRES_USERNAME postgres
setx POSTGRES_PASSWORD abcd1234
setx POSTGRES_HOST mypostgres-database-1.c5szli4s4qq9.us-east-1.rds.amazonaws.com
setx POSTGRES_DB postgres
setx AWS_BUCKET test-nd9990-dev-wc
setx AWS_REGION us-east-1
setx AWS_PROFILE nd9990
setx JWT_SECRET hello
setx URL http://localhost:8100
```

# Get Started!
Now that we have our prerequsites set up and configured, we will be following up this section with an overview of how to run the application.

## Project Assessment
To understand how you project will be assessed, see the <a href="https://review.udacity.com/#!/rubrics/2804/view" target="_blank">Project Rubric</a>
