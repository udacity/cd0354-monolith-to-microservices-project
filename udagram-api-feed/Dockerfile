FROM node:13
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies

COPY package*.json ./
RUN npm install --save-dev @types/lodash@4.14.167
RUN npm install --save-dev @types/bluebird@3.5.33
RUN npm install --save-dev @types/express@4.17.10
RUN npm install --save-dev @types/express-serve-static-core@4.17.18
RUN npm ci 
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "prod" ]