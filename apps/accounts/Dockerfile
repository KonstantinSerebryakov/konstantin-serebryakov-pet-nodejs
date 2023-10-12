# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY apps/my-nest-app/package*.json ./

# Install NestJS application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY apps/my-nest-app ./

# Expose the port your NestJS application runs on (it's usually 3000)
EXPOSE 3000

# Define the command to run your NestJS application
CMD ["npm", "run", "start:prod"]
