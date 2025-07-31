# Use Node.js 18 (as required by package.json)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create environment file with default values for development
RUN echo "NODE_ENV=development" > .env && \
    echo "SESSION_SECRET=your-session-secret-here" >> .env && \
    echo "PUBLIC_STOREFRONT_API_TOKEN=your-token-here" >> .env && \
    echo "PRIVATE_STOREFRONT_API_TOKEN=your-private-token-here" >> .env && \
    echo "PUBLIC_STORE_DOMAIN=your-store.myshopify.com" >> .env && \
    echo "PUBLIC_STOREFRONT_ID=your-storefront-id" >> .env

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application in preview mode
CMD ["npm", "run", "preview"]
