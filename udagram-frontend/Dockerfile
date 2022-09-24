## Build
FROM beevelop/ionic:latest AS ionic

# Create app dir
WORKDIR /usr/src/app

# Install dependencies
COPY pack*.json ./
RUN npm ci

# Bundle app source
COPY . .
RUN ionic build

## Run
FROM nginx:alpine
COPY --from=ionic /usr/src/app/www /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
