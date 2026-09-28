# Use Node.js 20 Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the backend port (change this to 4000 or your app's specific port if it's not 5000)
EXPOSE 5000

# Command to start your server
CMD ["npm", "start"]