# Use the specified version of the ionic image
FROM beevelop/ionic:latest AS ionic
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci -force
# Bundle app source
COPY . .
# Add the --openssl-legacy-provider option to the build command
RUN NODE_OPTIONS=--openssl-legacy-provider ionic build -f
# Run the NGINX image
FROM nginx:alpine
# Copy the built frontend files to the NGINX web server directory
COPY --from=ionic /usr/src/app/www /usr/share/nginx/html
