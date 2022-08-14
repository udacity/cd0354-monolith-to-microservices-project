# Udagram Image Filtering Application

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into two parts:
1. Frontend - Angular web application built with Ionic Framework
2. Backend RESTful API - Node-Express application

## Getting Started
> _tip_: it's recommended that you start with getting the backend API running since the frontend web application depends on the API.

### Prerequisites
The following tools will help you run your project locally as a monolithic application:

- PostgreSQL client, the `psql` command line utility, installed locally. Using PostgreSQL involves a server and a client. The server hosts the database while the client interfaces with it to execute queries. Because we will be creating our server on AWS, we will only need to install a client for our local setup. The easiest way to set this up is with the [https://www.postgresql.org/download/](PostgreSQL Installer). This installer installs a PostgreSQL client in the form of the psql command-line utility. You can see the complete (server and client) installation instructions for [https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/](Mac, Linux, and Windows). Verify using:

`psql --version`

- [https://ionicframework.com/docs/intro/cli](Ionic command-line utility) v6 framework to build and run the frontend application locally. In general, Ionic Framework is used to make cross-platform applications using JavaScript. Verify the installation as:

`ionic --version`

- [https://docs.docker.com/desktop/#download-and-install](Docker Desktop) for running the project locally in a multi-container environment

- [https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html](AWS CLI v2) for interacting with AWS services via your terminal. After installing the AWS CLI, you will also have to configure the access profile locally.
  
  - Create an IAM user with Admin privileges on the AWS web console. Copy its Access key.
  - Configure the access profile locally using the Access key generated above:

```bash
aws configure
aws iam list-users
```

- [https://kubernetes.io/docs/tasks/tools/#kubectl](Kubectl) command-line utility to communicate with Kubernetes clusters

- The setup depends on the Node Package Manager (NPM). You will need to download and install Node from [https://nodejs.com/en/download](https://nodejs.org/en/download/). This will allow you to be able to run `npm` commands.

- Environment variables will need to be set. These environment variables include database connection details that should not be hard-coded into the application code.

#### Environment Script
A file named `set_env.sh` has been prepared as an optional tool to help you configure these variables on your local development environment.
 
We do _not_ want your credentials to be stored in git. After pulling this `starter` project, run the following command to tell git to stop tracking the script in git but keep it stored locally. This way, you can use the script for your convenience and reduce risk of exposing your credentials.
`git rm --cached set_env.sh`

Afterwards, we can prevent the file from being included in your solution by adding the file to our `.gitignore` file.

### 1. Database
Create a PostgreSQL database either locally or on AWS RDS. The database is used to store the application's metadata.

* We will need to use password authentication for this project. This means that a username and password is needed to authenticate and access the database.
* The port number will need to be set as `5432`. This is the typical port that is used by PostgreSQL so it is usually set to this port by default.

Once your database is set up, set the config values for environment variables prefixed with `POSTGRES_` in `set_env.sh`.
* If you set up a local database, your `POSTGRES_HOST` is most likely `localhost`
* If you set up an RDS database, your `POSTGRES_HOST` is most likely in the following format: `***.****.us-west-1.rds.amazonaws.com`. You can find this value in the AWS console's RDS dashboard.


### 2. S3
Create an AWS S3 bucket. The S3 bucket is used to store images that are displayed in Udagram.

Set the config values for environment variables prefixed with `AWS_` in `set_env.sh`.

### 3. Backend API
Launch the backend API locally. The API is the application's interface to S3 and the database.

* To download all the package dependencies, run the command from the directory `udagram-api/`:
    ```bash
    npm install .
    ```
* To run the application locally, run:
    ```bash
    npm run dev
    ```
* You can visit `http://localhost:8080/api/v0/feed` in your web browser to verify that the application is running. You should see a JSON payload. Feel free to play around with Postman to test the API's.

### 4. Frontend App
Launch the frontend app locally.

* To download all the package dependencies, run the command from the directory `udagram-frontend/`:
    ```bash
    npm install .
    ```
* Install Ionic Framework's Command Line tools for us to build and run the application:
    ```bash
    npm install -g ionic
    ```
* Prepare your application by compiling them into static files.
    ```bash
    ionic build
    ```
* Run the application locally using files created from the `ionic build` command.
    ```bash
    ionic serve
    ```
* You can visit `http://localhost:8100` in your web browser to verify that the application is running. You should see a web interface.

### Microservices

The objective of this part of the project is to:

- Refactor the monolith application to microservices
- Set up each microservice to be run in its own Docker container

Once you refactor the Udagram application, it will have the following services running internally:

Backend `/user/` service - allows users to register and log into a web client.
Backend `/feed/` service - allows users to post photos, and process photos using image filtering.
Frontend - It is a basic Ionic client web application that acts as an interface between the user and the backend services.
Nginx as a reverse proxy server - for resolving multiple services running on the same port in separate containers. When different backend services are running on the same port, then a reverse proxy server directs client requests to the appropriate backend server and retrieves resources on behalf of the client.

*Keep in mind that we don’t want to make any feature changes to the frontend or backend code. If a user visits the frontend web application, it should look the same regardless of whether the application is structured as a monolith or microservice.*

Navigate to the project directory, and set up the environment variables again:

`source set_env.sh`

### 1.Refactor the Backend API

The current */project/udagram-api/* backend application code contains logic for both */users/* and */feed/* endpoints. Let's decompose the API code into the following two separate services that can be run independently of one another.

*1./project/udagram-api-feed/*
*2./project/udagram-api-user/*

Create two new directories (as services) with the names above. Copy the backend starter code into the above individual services, and then break apart the monolith.  Each of the services above will have the following directory structure shown below, with a lot of duplicate code. For both services, remove code that doesn't relate to the other i.e for */user/*, remove code that applies to */feed/* and vice-versa.

Create the same Dockerfile for the above two backend services.

### 2. Refactor the Frontend Application
In the frontend service, you just need to add a Dockerfile to the */project/udagram-frontend/* directory.

**Tip**: *Add `.dockerignore` to each of the services above, and mention `node_modules` in that file. It will ensure that the `node_modules` will not be included in the Dockerfile `COPY` commands.*

### 3.Reverse proxy

Use another container named *reverseproxy* running the Nginx server. The *reverseproxy* service will help add another layer between the frontend and backend APIs so that the frontend only uses a single endpoint and doesn't realize it's deployed separately. To set up the reverseproxy container, follow the steps below:

1. Create a newer directory */project/udagram-reverseproxy/*
2. Create a Dockerfile
3. Create the *nginx.conf* file that will associate all the service endpoints

The Nginx container will expose 8080 port. The configuration file above, in the `server` section, it will route the http://localhost:8080/api/v0/feed requests to the backend-user:8080 container. The same applies for the http://localhost:8080/api/v0/users requests.

### 4. Containerization

- Once you have created the Dockerfile in each of the following services directories, you can use the `docker-compose` command to build and run multiple Docker containers at once.

*/project/udagram-api-feed/*
*/project/udagram-api-feed/*
*/project/udagram-frontend/*
*/project/udagram-reverseproxy/*

The `docker-compose` command uses a YAML file to configure your application’s services in one go. Meaning, you create and start all the services from your configuration file, with a single command. Otherwise, you will have to individually build containers one-by-one for each of your services.

-  In the project's parent directory, create a docker-compose-build.yaml file. It will create an image for each individual service. Then, you can run the following command to create images locally:

```bash
docker image prune --all
docker-compose -f docker-compose-build.yaml build --parallel
``` 

Depending on your internet connection, you may experience challenges such as network timeout due to the large size of the beevelop/ionic base image. One way to combat this is to pull the base image from dockerhub then build the Ionic frontend image locally by running the `docker-compose` command. You can do this by running:

`docker pull beevelop/ionic:latest`

- Run containers using the images created in the step above. Create another YAML file, docker-compose.yaml, in the project's parent directory. It will use the existing images and create containers. While creating containers, it defines the port mapping, and the container dependency.

Once you have the YAML file above ready in your project directory, you can start the application using:

`docker-compose up`

- Visit http://localhost:8100 in your web browser to verify that the application is running.

### Continuous Integration

Prior to setting up a multi-container application in Kubernetes, you will need to set up a CI pipeline to build and push our application code as Docker images in DockerHub.

The end result that we want is a setup where changes in your GitHub code will automatically trigger a build process that generates Docker images.

### 1. Create Dockerhub Repositories
Log in to https://hub.docker.com/ and create four public repositories - each repository corresponding to your local Docker images. The names of the repositories must be exactly the same as the image name specified in the docker-compose-build.yaml file:

`reverseproxy`
`udagram-api-user`
`udagram-api-feed`
`udagram-frontend`

*Note: The names of the repositories are exactly the same as the `image name` specified in the docker-compose-build.yaml file.*

### 2. Setup CircleCI — A continuous integration and delivery platform
[https://circleci.com/](CircleCI) will be our tool of choice for Continuous Integration. It’s straightforward, popular, and comes with 1000 free monthly build minutes.

Head over to [https://github.com/marketplace](GitHub’s marketplace) and set up a plan.




## Tips
1. The `.dockerignore` file is included for your convenience to not copy `node_modules`. Copying this over into a Docker container might cause issues if your local environment is a different operating system than the Docker image (ex. Windows or MacOS vs. Linux).
2. It's useful to "lint" your code so that changes in the codebase adhere to a coding standard. This helps alleviate issues when developers use different styles of coding. `eslint` has been set up for TypeScript in the codebase for you. To lint your code, run the following:
    ```bash
    npx eslint --ext .js,.ts src/
    ```
    To have your code fixed automatically, run
    ```bash
    npx eslint --ext .js,.ts src/ --fix
    ```
3. `set_env.sh` is really for your backend application. Frontend applications have a different notion of how to store configurations. Configurations for the application endpoints can be configured inside of the `environments/environment.*ts` files.
4. In `set_env.sh`, environment variables are set with `export $VAR=value`. Setting it this way is not permanent; every time you open a new terminal, you will have to run `set_env.sh` to reconfigure your environment variables. To verify if your environment variable is set, you can check the variable with a command like `echo $POSTGRES_USERNAME`.
