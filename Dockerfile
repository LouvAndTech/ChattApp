## Build
FROM golang:1.19.3-alpine3.16 AS build

WORKDIR /

# Build the backend
# Copy the dependencies list
COPY ./chatapp-back/go.mod ./
COPY ./chatapp-back/go.sum ./
# Install dependencies
RUN go mod download
#Copy the backend code
COPY ./chatapp-back/*.go ./
# Build the backend
RUN CGO_ENABLED=0 go build -o ./backend-exe



# Use official node image as the base image
FROM node:alpine3.17 as front

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./chatapp-front/ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build


##Deploy
FROM gcr.io/distroless/base-debian10

#create a directory for the app
WORKDIR /

# Copy the backend binary
COPY --from=build /backend-exe ./
# Copy the frontend Code
COPY --from=front /usr/local/app/dist/chatapp-front ./pb_public/
#COPY ./chatapp-front/dist/chatapp-front ./pb_public/
# Expose the port
EXPOSE 8090
#Give a volume to extract the dataBase
VOLUME ["/pb_data"]


# Execute the backend
CMD [ "./backend-exe", "serve", "--http", "0.0.0.0:8090" ]