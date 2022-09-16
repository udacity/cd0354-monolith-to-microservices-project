# Part 2 - Run the project locally in a multi-container environment

The objective of this part of the project is to:

* Refactor the monolith application to microservices
* Set up each microservice to be run in its own Docker container

Once you refactor the Udagram application, it will have the following services running internally:

1. Backend `/user/` service - allows users to register and log into a web client.
1. Backend `/feed/` service - allows users to post photos, and process photos using image filtering. 
1. Frontend - It is a basic Ionic client web application that acts as an interface between the user and the backend services.
1. Nginx as a reverse proxy server - for resolving multiple services running on the same port in separate containers. When different backend services are running on the same port, then a reverse proxy server directs client requests to the appropriate backend server and retrieves resources on behalf of the client.

> Keep in mind that we don’t want to make any feature changes to the frontend or backend code. If a user visits the frontend web application, it should look the same regardless of whether the application is structured as a monolith or microservice.  





Navigate to the project directory, and set up the environment variables again:

```bash
source set_env.sh
```

### Refactor the Backend API

The current */project/udagram-api/* backend application code contains logic for both */users/*  and */feed/*  endpoints. Let's decompose the API code into the following two separate services that can be run independently of one another.

1. */project/udagram-api-feed/* 
1. */project/udagram-api-user/* 

Create two new directories (as services) with the names above. Copy the backend starter code into the above individual services, and then break apart the monolith. Each of the services above will have the following directory structure, with a lot of duplicate code.

```bash
.
├── mock           # Common and no change 
├── node_modules   # Auto generated. Do not copy. Add this into the .gitignore and .dockerignore
├── package-lock.json # Auto generated. Do not copy.
├── package.json      # Common and no change 
├── src
│   ├── config        # Common and no change
│   ├── controllers/v0  # TODO: Keep either /feed or /users service.   Delete the other folder
│         ├── index.router.ts  # TODO: Remove code related to other (either feed or users) service 
│         └── index.router.ts  # TODO: Remove code related to other (either feed or users) service 
│   ├── migrations   # TODO: Remove the JSON related to other (either feed or users) 
│   └── server.ts    # TODO: Remove code related to other (either feed or users) service 
├── Dockerfile       # TODO: Create NEW, and common
└── .dockerignore    # TODO: Add "node_modules" to this file
```

The Dockerfile for the above two backend services will be like:

```bash
FROM node:13
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies

COPY package*.json ./
RUN npm ci 
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "prod" ]
```
> Note: A wildcard is used in the line `COPY package*.json ./` to ensure both package.json and package-lock.json are copied where available (npm@5+)

It's not a hard requirement to use the exact same Dockerfile above. Feel free to use other base images or optimize the commands.

### Refactor the Frontend Application

In the frontend service, you just need to add a Dockerfile to the */project/udagram-frontend/* directory. 

```bash
## Build
FROM beevelop/ionic:latest AS ionic
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci
# Bundle app source
COPY . .
RUN ionic build
## Run 
FROM nginx:alpine
#COPY www /usr/share/nginx/html
COPY --from=ionic  /usr/src/app/www /usr/share/nginx/html
```

> **Tip**: Add `.dockerignore` to each of the services above, and mention `node_modules` in that file. It will ensure that the `node_modules` will not be included in the Dockerfile `COPY` commands.  
>

### How would containers discover each other and communicate?
Use another container named *reverseproxy* running the Nginx server. The *reverseproxy* service will help add another layer between the frontend and backend APIs so that the frontend only uses a single endpoint and doesn't realize it's deployed separately. *This is one of the approaches and not necessarily the only way to deploy the services. *To set up the *reverseproxy* container, follow the steps below:

1. Create a newer directory */project/udagram-reverseproxy/  *
2. Create a Dockerfile as:
```bash
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
```

3. Create the *nginx.conf* file that will associate all the service endpoints as:
```bash
worker_processes 1;  
events { worker_connections 1024; }
error_log /dev/stdout debug;
http {
    sendfile on;
    upstream user {
        server backend-user:8080;
    }
    upstream feed {
        server backend-feed:8080;
    }
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-NginX-Proxy true;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Host $server_name;    
    server {
        listen 8080;
        location /api/v0/feed {
            proxy_pass         http://feed;
        }
        location /api/v0/users {
            proxy_pass         http://user;
        }            
    }
}
```
The Nginx container will expose 8080 port. The configuration file above, in the `server` section, it will route the *http://localhost:8080/api/v0/feed* requests to the *backend-user:8080* container. The same applies for the *http://localhost:8080/api/v0/users* requests.


### Current Directory Structure
At this moment, your project directory would have the following structure:
```bash
.
├── udagram-api-feed
│   └── src
├── udagram-api-user
│   └── src
├── udagram-frontend
│   └── src
└── udagram-reverseproxy
```



### Use Docker compose to build and run multiple Docker containers

> **Note**: The ultimate objective of this step is to have the Docker images for each microservice ready locally. This step can also be done manually by building and running containers one by one. 


1. Once you have created the Dockerfile in each of the following services directories, you can use the `docker-compose` command to build and run multiple Docker containers at once.

   - */project/udagram-api-feed/* 
   - */project/udagram-api-feed/* 
   - */project/udagram-frontend/* 
   - */project/udagram-reverseproxy/*

 The `docker-compose`  <a href="https://docs.docker.com/compose/" target="_blank">command</a> uses a YAML file to configure your application’s services in one go. Meaning, you create and start all the services from your configuration file, with a single command. Otherwise, you will have to individually build containers one-by-one for each of your services. 



2. **Create Images** - In the project's parent directory, create a [docker-compose-build.yaml](https://video.udacity-data.com/topher/2021/July/60e28b72_docker-compose-build/docker-compose-build.yaml) file. It will create an image for each individual service. Then, you can run the following command to create images locally:
```bash
# Make sure the Docker services are running in your local machine
# Remove unused and dangling images
docker image prune --all
# Run this command from the directory where you have the "docker-compose-build.yaml" file present
docker-compose -f docker-compose-build.yaml build --parallel
```
>**Note**: YAML files are extremely indentation sensitive, that's why we have attached the files for you. 


3. **Run containers** using the images created in the step above. Create another YAML file, [docker-compose.yaml](https://video.udacity-data.com/topher/2021/July/60e28b91_docker-compose/docker-compose.yaml),  in the project's parent directory. It will use the existing images and create containers. While creating containers, it defines the port mapping, and the container dependency. 

 Once you have the YAML file above ready in your project directory, you can start the application using:
```bash
docker-compose up
```

4. Visit http://localhost:8100 in your web browser to verify that the application is running. 


