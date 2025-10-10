#!/bin/bash

# Navigate to the docker development directory
cd "$(dirname "$0")/docker/development"

# Build and start Docker Compose in development mode
echo "Building and starting Docker containers in development mode..."
docker compose up -d --build

echo "Containers started successfully!"
echo "Run './stop.sh' to stop the containers"

