#!/bin/bash

docker-compose -f docker-compose-build.yaml build

docker tag reverseproxy "kouna77/reverseproxy:v1.2"
docker tag udagram-api-user "kouna77/udagram-api-user:v1.1"
docker tag udagram-api-feed "kouna77/udagram-api-feed:v1.1"
docker tag udagram-frontend:local "kouna77/udagram-frontend:v1.2"

echo F@llou77 | docker login --username kouna77 --password-stdin

docker push "kouna77/reverseproxy:v1.2" &
docker push "kouna77/udagram-api-user:v1.1" &
docker push "kouna77/udagram-api-feed:v1.1" &
docker push "kouna77/udagram-frontend:v1.2" &
wait