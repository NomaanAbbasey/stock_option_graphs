# Stage 1: Build the application
FROM node:18 AS build

# Set the working directory
WORKDIR /graphs_options_microservice

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application using Vite
RUN npm run build

# Stage 2: Serve the application with a lightweight server
FROM nginx:alpine

# Copy the build output to Nginx's HTML directory
COPY --from=build /graphs_options_microservice/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]