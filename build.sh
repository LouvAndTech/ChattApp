#!/bin/bash
cd chatapp-front/
npm install
ng build --configuration=production
cd ..
docker build --tag chat-app .
echo("Compliation Done")