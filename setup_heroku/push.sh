#!/bin/bash

# Define your Heroku app name
APP_NAME="share-portfolio-accounts"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI is not installed. Please install it and log in."
    exit 1
fi

# Load environment variables from .env
set -a
[ -f .env ] && . .env
set +a

# Push each key-value pair to Heroku app's config vars
for line in $(cat .env); do
    if [[ $line != \#* ]]; then
        key=$(echo $line | cut -d= -f1)
        value=$(echo $line | cut -d= -f2)
        echo "Setting $key..."
        heroku config:set $key="$value" --app $APP_NAME
    fi
done

echo "Config vars updated on Heroku app: $APP_NAME"
