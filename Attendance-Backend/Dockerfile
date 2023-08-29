# Use an official Node.js runtime as the base image (version 12)
FROM node:12

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Start your Node.js app with nodemon
CMD ["npm", "start"]
