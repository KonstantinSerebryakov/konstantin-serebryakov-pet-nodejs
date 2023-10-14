#!/bin/bash

# Define your Heroku app name
APP_NAME="share-portfolio-accounts"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI is not installed. Please install it and log in."
    exit 1
fi

# Check if a custom .env file path is provided as an argument
if [ $# -eq 0 ]; then
    ENV_FILE=".env"
else
    ENV_FILE="$1"
fi

# Load environment variables from the specified .env file
if [ -f "$ENV_FILE" ]; then
    while IFS= read -r line; do
        if [[ $line != \#* ]]; then
            key="${line%%=*}"
            value="${line#*=}"
            echo "Setting $key..."
            echo "With $value..."
            heroku config:set "$key"="$value" --app "$APP_NAME"
        fi
    done < "$ENV_FILE"
else
    echo "The specified .env file '$ENV_FILE' does not exist."
    exit 1
fi

echo "Config vars updated on Heroku app: $APP_NAME"
