FROM node:12

# Create app dir
WORKDIR /usr/src/app

#install dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "prod" ]
