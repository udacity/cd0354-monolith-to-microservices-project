FROM node:14

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm ci

COPY . .

EXPOSE 9000

CMD [ "npm", "run", "prod" ]