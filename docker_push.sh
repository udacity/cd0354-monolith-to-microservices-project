#!/bin/bash

docker-compose -f docker-compose-build.yaml build

docker tag reverseproxy "${DOCKER_USERNAME}/reverseproxy:v1.1"
docker tag udagram-api-user "${DOCKER_USERNAME}/udagram-api-user:v1.1"
docker tag udagram-api-feed "${DOCKER_USERNAME}/udagram-api-feed:v1.1"
docker tag udagram-frontend:local "${DOCKER_USERNAME}/udagram-frontend:v1.1"

echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

docker push "${DOCKER_USERNAME}/reverseproxy:v1.1" &
docker push "${DOCKER_USERNAME}/udagram-api-user:v1.1" &
docker push "${DOCKER_USERNAME}/udagram-api-feed:v1.1" &
docker push "${DOCKER_USERNAME}/udagram-frontend:v1.1" &
wait
