#!/usr/bin/env bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push minhducvt293/udagram-api-feed:v1
docker push minhducvt293/udagram-api-user:v1
docker push minhducvt293/udagram-api-frontend:v1
docker push minhducvt293/udagram-api-reverseproxy:v1