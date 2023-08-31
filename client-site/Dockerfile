# Use an official Node.js runtime as the base image (version 14)
FROM node:12 AS Production

# Set the working directory inside the container
WORKDIR /usr/src/client

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy the rest of your application code into the container
COPY . ./

# Install app dependencies
RUN npm install


# Build the React app
RUN npm run build

# Expose the port your app will run on (React default is 3000)
EXPOSE 3001

# Start the React app
CMD ["npm", "start"]
