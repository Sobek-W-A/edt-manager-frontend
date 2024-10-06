# Build Stage
FROM node:20.18 AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY ./app .

# Build the React application
RUN npm run build

# Production Stage
FROM nginx:latest

# Copy the NGINX configuration file
COPY ./app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build artifacts from the build stage to NGINX web server
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 for the NGINX server
EXPOSE 80

# Command to start NGINX when the container is run
CMD ["nginx", "-g", "daemon off;"]
