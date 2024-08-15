FROM node:14 AS ionic
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install -f
RUN npm install -g ionic
COPY . .
RUN ionic build
FROM nginx:alpine
EXPOSE 80
#COPY www /usr/share/nginx/html
COPY --from=ionic  /usr/src/app/www /usr/share/nginx/html