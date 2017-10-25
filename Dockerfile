# Use an official Python runtime as a parent image
FROM node:8.7

# Copy the current directory contents into the container at /app
COPY . /app

# Set the working directory to /app
WORKDIR /app

# Make port 80 available to the world outside this container
EXPOSE 8080

# Run index.js when the container launches
CMD ["node", "index.js"]
