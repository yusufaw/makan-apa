#!/bin/sh

#source .env

ssh $HOST_USERNAME@$HOST_IP_ADDRESS<<EOF
    cd /home/$HOST_USERNAME/workspace/makan-apa
    git pull origin main
    PATH="/home/$HOST_USERNAME/.nvm/versions/node/v16.16.0/bin:$PATH"
    npm install
    pm2 restart all
   exit
EOF