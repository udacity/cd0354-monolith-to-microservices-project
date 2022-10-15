## Build
FROM node:14.15.5-alpine3.13 as build
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard...ci
RUN npm install -g @ionic/cli
# Bundle app source
COPY . .
RUN ionic build
## Run 
FROM nginx:alpine
#COPY www /usr/share/nginx/html
COPY --from=build /usr/src/app/www /usr/share/nginx/html