#!/bin/bash

LOCAL_PORT=3020
PROJECT_DIR="/Users/sidheshpatil/Downloads/Minor-project"
URL_FILE="$PROJECT_DIR/latest_url.txt"
LOG_FILE="$PROJECT_DIR/cloudflared.log"
IMAGE_NAME="college-management-system"

pkill -f cloudflared
docker rm -f cms_container 2>/dev/null

> "$URL_FILE"

echo "Starting Docker Desktop..."
open -a /Applications/Docker.app

echo "Waiting for Docker to be ready..."
while ! docker info > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo "Docker is ready!"

echo "Starting container..."
docker run -dp 3020:80 --name cms_container --rm "$IMAGE_NAME"

echo "Starting Cloudflare Tunnel..."
cloudflared tunnel --url http://localhost:$LOCAL_PORT > "$LOG_FILE" 2>&1 &

cd Download/Minor-project
git init
git add -A
git commit -m "URL changed"
git push origin main
counter=0
while [ $counter -lt 30 ]; do
    NEW_URL=$(grep -o 'https://[a-z-]*\.trycloudflare\.com' "$LOG_FILE" | tail -n 1)

    if [ ! -z "$NEW_URL" ]; then
        echo "$NEW_URL" > "$URL_FILE"
        echo "Success! New URL captured: $NEW_URL"
        exit 0
    fi
    sleep 1
    ((counter++))
done

echo "Error: Timed out waiting for URL generation."
exit 1
