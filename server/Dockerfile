# Use Node 18
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5001

# Start the application
CMD ["npm", "run", "dev"]
