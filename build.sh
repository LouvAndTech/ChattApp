#!/bin/bash

#Variables
DOCKERFILE="Dockerfile"

# Functions
instructions_front () {
    echo "---- Frontend build (first arg) : ----"
    echo ">>>Use : './build.sh --localAngular | -la‘ To build the frontend locally"
    echo ">>>Use : './build.sh --dockerAngular | -dr' To build the frontend in the dockerfile"
}

instructions_image () {
    echo "---- Image build (second arg) : ----"
    echo ">>>Use : \'./build.sh --active | -a\‘ To build the image for local achitecture only"
    echo ">>>Use : \'./build.sh --multi | -m\' To build the image for amd64/arm64/armv7 achitectures"
}


#START SCRIPT

# check if arguments are given
if [ $# -lt '2' ];
then
    echo ">>>No Argument specified !!"
    instructions_front
    instructions_image
    exit 1
fi

# check if frontend is to be build locolly or in the dockerfile
if [ $1 = '--localAngular' ] || [ $1 = '-la' ];
then
    echo ">>>Build Frontend locally"
    cd chatapp-front/
    npm install
    ng build --configuration=production
    cd ..
    DOCKERFILE='Dockerfile.noAngular'
elif [ $1 = '--dockerAngular' ] || [ $1 = '-dr' ];
then
    echo ">>>Build Frontend in Docker"
else
    echo ">>>No Frontend builded !!"
    instructions_front
    exit 1
fi


# Build Docker Image
if [ $2 = '--multi' ] || [ $2 = '-m' ];
then
    echo "Build for Multi-Arch"
    #Build for Multi-Arch
    docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t louvandtech/chat-app --push -f $DOCKERFILE .
elif [ $2 = '--active' ] || [ $2 = '-a' ];
then
    echo "Build for active Arch"
    #Build for active Arch
    docker build --tag louvandtech/chat-app -f $DOCKERFILE .
else
    echo ">>>No Arch specified !!"
    instructions_image
    exit 1
fi

echo ">>>Compliation Done !"


