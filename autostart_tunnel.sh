#!/bin/bash

PROJECT_DIR="/Users/sidheshpatil/Downloads/Minor-project"
URL_FILE="latest_url.txt"
LOG_FILE="cloudflared.log"
IMAGE_NAME="college-management-system"

pkill -f cloudflared
docker rm -f cms_container 2>/dev/null

> "$PROJECT_DIR/$URL_FILE"

echo "Starting Docker..."
open -a /Applications/Docker.app
while ! docker info > /dev/null 2>&1; do sleep 2; done

echo "Starting Container..."
docker run -dp 3020:80 --name cms_container --rm "$IMAGE_NAME"

echo "Waiting for app to respond on port 3020..."
until $(curl --output /dev/null --silent --head --fail http://localhost:3020); do
    sleep 1
done
echo "Running perfect locally"

echo "Starting Cloudflare Tunnel..."
cloudflared tunnel --protocol http2 --no-autoupdate --edge-ip-version 4 --url http://localhost:3020 > "$LOG_FILE" 2>&1 &

counter=0
while [ $counter -lt 30 ]; do
    NEW_URL=$(grep -o 'https://[a-z-]*\.trycloudflare\.com' "$PROJECT_DIR/$LOG_FILE" | tail -n 1)

    if [ ! -z "$NEW_URL" ]; then
        echo "$NEW_URL" > "$PROJECT_DIR/$URL_FILE"
        echo "Success! New URL captured: $NEW_URL"

        cd "$PROJECT_DIR" || exit
        
        if [ ! -d ".git" ]; then git init; fi
        
        git add "$URL_FILE"
        git commit -m "Update Tunnel URL: $NEW_URL"
        
        git push origin main
        
        echo "Pushed to GitHub successfully."
        exit 0
    fi
    sleep 1
    ((counter++))
done

echo "Error: Timed out waiting for URL."
exit 1
