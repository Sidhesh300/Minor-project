#!/bin/bash

LOCAL_PORT=3020
URL_FILE="/Users/sidheshpatil/Downloads/Minor-project/latest_url.txt"
LOG_FILE="/Users/sidheshpatil/Downloads/Minor-project/cloudflared.log"

> "$URL_FILE"
open -a /Applications/Docker.app
docker run -dp 3020:80 college-management-system
cloudflared tunnel --url http://localhost:$LOCAL_PORT > "$LOG_FILE" 2>&1 &

counter=0
while [ $counter -lt 30 ]; do
    NEW_URL=$(grep -o 'https://[a-z-]*\.trycloudflare\.com' "$LOG_FILE" | tail -n 1)

    if [ ! -z "$NEW_URL" ]; then
        echo "$NEW_URL" > "$URL_FILE"
        echo "New URL captured: $NEW_URL"
        exit 0
    fi
    sleep 1
    ((counter++))
done

echo "Timed out waiting for URL."
exit 1
