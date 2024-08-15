FROM node:14
WORKDIR /usr/src/app
COPY ./udagram-api-feed/package*.json ./
RUN npm install -f
COPY ./udagram-api-feed/ ./
EXPOSE 8080
CMD [ "npm", "run", "prod" ]
