FROM node:16-alpine3.16

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies

COPY package*.json ./
RUN npm ci 
# Bundle app source
COPY . .

# Build app
RUN npm run tsc

EXPOSE 8080
CMD [ "npm", "run", "prod" ]
