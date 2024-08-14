FROM node:12
WORKDIR /usr/src/app
COPY ./udagram-api-feed/package*.json ./
RUN npm ci 
COPY ./udagram-api-feed/ ./
EXPOSE 8020
CMD [ "npm", "run", "prod" ]