#!/bin/sh

source .env

ssh root@$HOST_IP_ADDRESS<<EOF
    su fi0smith
    cd /home/fi0smith/workspace/makan-apa
    git pull origin master
    npm install
    pm2 restart all
   exit
EOF