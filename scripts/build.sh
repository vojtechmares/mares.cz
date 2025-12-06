#!/usr/bin/env bash

set -euo pipefail

# Load environment variables from .prod.env
if [ ! -f "./.prod.env" ]; then
  echo "Error: .prod.env file not found"
  exit 1
fi

# Source the .prod.env file
set -a
source ./.prod.env
set +a

# Validate required environment variables
REQUIRED_VARS=(
  "STRAPI_API_URL"
  "STRAPI_API_TOKEN"
  "NOTION_API_KEY"
  "NOTION_TRAINING_SESSIONS_DATABASE_ID"
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "Error: $var is not set in .prod.env"
    exit 1
  fi
done

# Default image name and tag
IMAGE_NAME="${IMAGE_NAME:-mares.cz}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "Building Docker image: $IMAGE_NAME:$IMAGE_TAG"

# Build the Docker image with secrets
docker build \
  --secret id=STRAPI_API_URL,env=STRAPI_API_URL \
  --secret id=STRAPI_API_TOKEN,env=STRAPI_API_TOKEN \
  --secret id=NOTION_API_KEY,env=NOTION_API_KEY \
  --secret id=NOTION_TRAINING_SESSIONS_DATABASE_ID,env=NOTION_TRAINING_SESSIONS_DATABASE_ID \
  -t "$IMAGE_NAME:$IMAGE_TAG" \
  .

echo "Successfully built $IMAGE_NAME:$IMAGE_TAG"
