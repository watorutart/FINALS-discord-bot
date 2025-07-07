# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S discord-bot -u 1001

# Change ownership of the app directory
RUN chown -R discord-bot:nodejs /app
USER discord-bot

# Expose port for health checks
EXPOSE 3000

# Start the application
CMD ["npm", "start"]