#!/bin/sh

source .env

ssh root@$HOST_IP_ADDRESS<<EOF
    su fi0smith
    cd /home/fi0smith/workspace/makan-apa
    git pull origin main
    PATH="/home/fi0smith/.nvm/versions/node/v16.16.0/bin:$PATH"
    npm install
    pm2 restart all
   exit
EOF