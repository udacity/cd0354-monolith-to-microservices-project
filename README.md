# Udagram Image Filtering Application

Udagram is a simple cloud application developed alongside the Udacity Cloud Developer Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into the following services, each deployable as its own Docker container (see `Classroom_Project_Instructions/` for the full write-up):
1. `udagram-frontend` - Angular web application built with Ionic Framework
2. `udagram-api-feed` - Backend `/api/v0/feed` RESTful API (Node-Express)
3. `udagram-api-user` - Backend `/api/v0/users` RESTful API (Node-Express)
4. `udagram-reverseproxy` - Nginx reverse proxy routing frontend requests to the two backend APIs

Use `docker-compose-build.yaml` to build all four images and `docker-compose.yaml` to run them together locally (see "Run with Docker Compose" below). CI/CD is handled by the GitHub Actions workflow in `.github/workflows/docker-build-push.yml`, which builds and pushes all four images to Docker Hub on every push (functionally equivalent to the course's suggested Travis CI pipeline; a legacy `.travis.yml` is retained for reference but is not the active pipeline). Kubernetes manifests for deploying the Docker Hub images to an EKS (or any Kubernetes) cluster live in `udagram-deployment/` (see "Deploy to Kubernetes" below).

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

Set the config values for environment variables prefixed with `AWS_` in `set_env.sh`, then create the bucket (with public-access and CORS settings matching the course instructions) by running:
```bash
source set_env.sh
./scripts/create-s3-bucket.sh
```
This requires the AWS CLI to be configured with credentials that can create/administer S3 buckets (`aws configure --profile "$AWS_PROFILE"`). Alternatively, follow the manual console steps in `Classroom_Project_Instructions/Part_0_Prerequisites_and_Getting_Started.md`.

### 3. Backend APIs
Launch the backend APIs locally. Each API is the application's interface to S3 and the database for its own domain.

* To download all the package dependencies, run the command from each of `udagram-api-feed/` and `udagram-api-user/`:
    ```bash
    npm install .
    ```
* To run each application locally (in separate terminals, on different `PORT`s if running both at once), run:
    ```bash
    npm run dev
    ```
* You can visit `http://localhost:8080/api/v0/feed` (feed service) or `http://localhost:8080/api/v0/users` (user service) in your web browser to verify that the application is running. You should see a JSON payload. Feel free to play around with Postman to test the API's.

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

## Run with Docker Compose
1. Build all four images locally:
    ```bash
    docker-compose -f docker-compose-build.yaml build --parallel
    ```
2. Run the stack (requires `set_env.sh` to have been sourced so Postgres/S3/JWT variables are available):
    ```bash
    source set_env.sh
    docker-compose up
    ```
3. Visit `http://localhost:8100` in your browser to verify the application is running end-to-end.

> Replace the `alisaber21` placeholder in `docker-compose-build.yaml`, `docker-compose.yaml`, `.travis.yml`, and `udagram-deployment/*.yaml` with your real Docker Hub account before pushing/deploying images.

## Deploy to Kubernetes (EKS)
The `udagram-deployment/` directory contains Deployment, Service, and HorizontalPodAutoscaler manifests for all four services, pulling the images already published to Docker Hub by the GitHub Actions pipeline.

1. **Create a cluster** (or point `kubectl`/`aws eks update-kubeconfig` at an existing one):
    ```bash
    eksctl create cluster --name udagram --region us-east-1 --nodes 2 --node-type t3.medium
    ```
2. **Fill in the config/secret templates** with real values (do not commit real secrets):
   - `udagram-deployment/env-configmap.yaml`: `POSTGRES_HOST`, `AWS_BUCKET`, etc.
   - `udagram-deployment/env-secret.yaml`: `POSTGRES_PASSWORD`, `JWT_SECRET`
   - `udagram-deployment/aws-secret.yaml`: base64-encoded `~/.aws/credentials` (`cat ~/.aws/credentials | base64`, or build one from temporary STS creds if running in AWS CloudShell)
3. **Apply everything and verify:**
    ```bash
    cd udagram-deployment
    kubectl apply -f .
    kubectl get pods
    kubectl get services   # reverseproxy is type LoadBalancer; wait for an EXTERNAL-IP/hostname
    kubectl get hpa
    ```
   Or run `./deploy.sh` from `udagram-deployment/` for a scripted version of steps 2-3 (builds `aws-secret.yaml` automatically from AWS CloudShell's temporary credentials).
4. Visit `http://<reverseproxy-external-hostname>:8080/api/v0/feed` to confirm the deployment is reachable end-to-end.

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
