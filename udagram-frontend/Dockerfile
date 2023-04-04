## Build
FROM node:16.20.0-alpine as build
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci --force
RUN npm install -g @ionic/cli
# Bundle app source
COPY . .
RUN ionic build
## Run 
FROM nginx:alpine
#COPY www /usr/share/nginx/html
COPY --from=build /usr/src/app/www /usr/share/nginx/htmlcd