#!/bin/bash
cd chatapp-front/
npm install
ng build --configuration=production
cd ..
#Build for active Arch
#docker build --tag louvandtech/chat-app .
#Build for Multi-Arch
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t louvandtech/chat-app --push .
echo("Compliation Done")