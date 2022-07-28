# Make sure the Docker services are running in your local machine
# Remove unused and dangling images
docker image prune --all
# Run this command from the directory where you have the "docker-compose-build.yaml" file present
docker-compose -f docker-compose-build.yaml build --parallel