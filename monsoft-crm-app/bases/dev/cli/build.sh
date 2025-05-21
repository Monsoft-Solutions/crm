#!/bin/bash

IMAGE_NAME="monsoft"
CONTAINER_NAME="monsoft_container"
DOCKERFILE_PATH="./Docker/server.Dockerfile"
ENV_FILE=".env/local.env"

echo "Building Docker image..."
sudo docker build --squash -t $IMAGE_NAME -f $DOCKERFILE_PATH . || { echo "Build failed"; exit 1; }

if sudo docker ps -q -f name=$CONTAINER_NAME; then
    echo "Container $CONTAINER_NAME is running."
   
    echo "Stopping existing container..."
    sudo docker stop $CONTAINER_NAME
    sudo docker rm $CONTAINER_NAME
   
else
    echo "Container $CONTAINER_NAME is not running."
fi

echo "Running new container with environment variables..."
sudo docker run -d --name $CONTAINER_NAME --env-file $ENV_FILE -p 8080:8080 $IMAGE_NAME

echo "Container is now running."

echo "Showing logs of the container..."
sudo docker logs -f $CONTAINER_NAME