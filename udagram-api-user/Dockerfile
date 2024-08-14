FROM node:14
WORKDIR /usr/src/app
COPY ./udagram-api-user/package*.json ./
RUN npm install -f 
COPY ./udagram-api-user/ ./
EXPOSE 8010
CMD [ "npm", "run", "prod" ]