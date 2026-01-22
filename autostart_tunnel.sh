#!/bin/bash

LOCAL_PORT=3020
URL_FILE="/home/$(whoami)/latest_url.txt"
LOG_FILE="/home/$(whoami)/cloudflared.log"

/usr/local/bin/cloudflared tunnel --url http://localhost:$LOCAL_PORT > $LOG_FILE 2>&1 &

counter=0
while [ $counter -lt 30 ]; do
    NEW_URL=$(grep -o 'https://[a-z-]*\.trycloudflare\.com' $LOG_FILE | tail -n 1)
    
    if [ ! -z "$NEW_URL" ]; then
        echo "$NEW_URL" > $URL_FILE
        exit 0
    fi
    sleep 1
    ((counter++))
done
