#!/bin/bash

if [[ $TRAVIS_BRANCH == 'main' ]]
  docker-compose build -f docker-compose-build.yaml

  docker tag reverseproxy "${DOCKER_USERNAME}/reverseproxy:v1" .
  docker tag udagram-api-user "${DOCKER_USERNAME}/udagram-api-user:v1" .
  docker tag udagram-api-feed "${DOCKER_USERNAME}/udagram-api-feed:v1" .
  docker tag udagram-frontend "${DOCKER_USERNAME}/udagram-frontend:v1" .

  echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

  docker push "${DOCKER_USERNAME}/reverseproxy:v1" &
  docker push "${DOCKER_USERNAME}/udagram-api-user:v1" &
  docker push "${DOCKER_USERNAME}/udagram-api-feed:v1" &
  docker push "${DOCKER_USERNAME}/udagram-frontend:v1" &
  wait
else
  echo "No need to docker push now"
fi
