FROM beevelop/ionic:latest as ionic

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN ionic build

FROM nginx:alpine

COPY --from=ionic /usr/src/app/www /usr/share/nginx/html