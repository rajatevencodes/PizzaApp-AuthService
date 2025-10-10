#!/bin/bash

# Navigate to the docker development directory
cd "$(dirname "$0")/docker/development"

# Stop Docker Compose
echo "Stopping Docker containers..."
docker compose down

echo "Containers stopped successfully!"

