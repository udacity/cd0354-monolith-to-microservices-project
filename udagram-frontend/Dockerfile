### Build
FROM beevelop/ionic:latest AS ionic
## Create app directory
WORKDIR /usr/src/app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_OPTIONS=--openssl-legacy-provider
## Install app dependencies
## A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm i -f
## Bundle app source
COPY . .
RUN ionic build 
### Run 
FROM nginx:alpine
#COPY www /usr/share/nginx/html
COPY --from=ionic  /usr/src/app/www /usr/share/nginx/html