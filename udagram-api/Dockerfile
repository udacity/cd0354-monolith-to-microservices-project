FROM node:14
WORKDIR /usr/src/app
COPY ./udagram-api/package*.json ./
RUN npm install -f 
COPY ./udagram-api/ ./
EXPOSE 8010
CMD [ "npm", "run", "dev" ]