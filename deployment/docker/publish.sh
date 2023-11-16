#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo "$DOCKER_PASSWORD"
echo "$DOCKER_USERNAME"

docker-compose -f deployment/docker/docker-compose-build.yaml push