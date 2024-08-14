FROM node:14 AS ionic
WORKDIR /usr/src/app
COPY ./udagram-frontend/package*.json ./
RUN npm install -f
RUN npm install -g ionic
COPY ./udagram-frontend/ .
RUN ionic build
FROM nginx:alpine
#COPY www /usr/share/nginx/html
COPY --from=ionic  /usr/src/app/www /usr/share/nginx/html