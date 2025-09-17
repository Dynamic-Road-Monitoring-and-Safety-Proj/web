#!/bin/bash

# Start the backend server with environment variables from .env file
cd "$(dirname "$0")/app"

# Source the .env file
if [ -f "../.env" ]; then
    export $(cat ../.env | grep -v '#' | xargs)
fi

# Start the server
echo "🚀 Starting backend server with geocoding=${ENABLE_GEOCODING:-false}"
"../../../.venv/bin/python" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload