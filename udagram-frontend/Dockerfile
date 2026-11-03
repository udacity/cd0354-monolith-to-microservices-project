# Build
FROM node:20 AS build
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci
# Bundle app source
COPY . .
RUN npx ng build

# Run
FROM nginx:alpine
COPY --from=build /usr/src/app/www /usr/share/nginx/html
EXPOSE 80
