# Udagram Image Filtering Application

Udagram is a simple cloud application developed alongside the Udacity Cloud Developer Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into two parts:
1. Frontend - Angular web application built with Ionic Framework
2. Backend RESTful API - Node-Express application

## Getting Started
> _tip_: it's recommended that you start with getting the backend API running since the frontend web application depends on the API.

### Prerequisite
1. The depends on the Node Package Manager (NPM). You will need to download and install Node from [https://nodejs.com/en/download](https://nodejs.org/en/download/). This will allow you to be able to run `npm` commands.
2. Environment variables will need to be set. These environment variables include database connection details that should not be hard-coded into the application code.

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

## Tips
1. Take a look at `udagram-api` -- does it look like we can divide it into two modules to be deployed as separate microservices?
2. The `.dockerignore` file is included for your convenience to not copy `node_modules`. Copying this over into a Docker container might cause issues if your local environment is a different operating system than the Docker image (ex. Windows or MacOS vs. Linux).
3. It's useful to "lint" your code so that changes in the codebase adhere to a coding standard. This helps alleviate issues when developers use different styles of coding. `eslint` has been set up for TypeScript in the codebase for you. To lint your code, run the following:
    ```bash
    npx eslint --ext .js,.ts src/
    ```
    To have your code fixed automatically, run
    ```bash
    npx eslint --ext .js,.ts src/ --fix
    ```
4. `set_env.sh` is really for your backend application. Frontend applications have a different notion of how to store configurations. Configurations for the application endpoints can be configured inside of the `environments/environment.*ts` files.
5. In `set_env.sh`, environment variables are set with `export $VAR=value`. Setting it this way is not permanent; every time you open a new terminal, you will have to run `set_env.sh` to reconfigure your environment variables. To verify if your environment variable is set, you can check the variable with a command like `echo $POSTGRES_USERNAME`.



## Submission
1. *Build and run a container image using Docker*

<img width="1438" alt="Screenshot 2022-10-17 at 02 07 26" src="https://user-images.githubusercontent.com/55222856/196074516-8676b131-657e-498c-b794-f9f7dd2937f6.png">

2. *Use Travis to build a CI/CD pipeline*
Due to the charges attached to Travis, I used **GitHub Actions** for this project instead. Below is a screenshot of its build.

<img width="1438" alt="Screenshot 2022-10-17 at 02 08 59" src="https://user-images.githubusercontent.com/55222856/196074683-1cec0230-4805-4ee5-b343-62f96d048e5b.png">

3. *Deploy microservices using a Kubernetes cluster on AWS*
 - `kubectl get pods`
 
 <img width="968" alt="Screenshot 2022-10-17 at 01 44 22" src="https://user-images.githubusercontent.com/55222856/196074893-0502ecaf-158c-445b-99d7-131ca4d3bf36.png">

 
 - `kubectl describe services`

<img width="1440" alt="Screenshot 2022-10-17 at 03 21 52" src="https://user-images.githubusercontent.com/55222856/196075658-7701f0a9-3164-4aa5-99eb-6dde7febb2dc.png">

 
4. *Use a reverse proxy to direct requests to the appropriate backend*
The screenshot above (`kubectl describe services`), showing the Kubernetes services shows a reverse proxy.

5. *Configure scaling and self-healing for each service (`kubectl describe hpa`)*

<img width="978" alt="Screenshot 2022-10-17 at 03 23 29" src="https://user-images.githubusercontent.com/55222856/196075784-6bd77944-ea89-4d80-8ad9-2f652a122dc5.png">

6. *Use logs to capture metrics for debugging a microservices deployment*

<img width="934" alt="Screenshot 2022-10-17 at 03 27 28" src="https://user-images.githubusercontent.com/55222856/196076158-45910d56-79d8-4ec2-9c4c-06228cd629d6.png">

