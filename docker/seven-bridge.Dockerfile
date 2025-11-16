# Example Dockerfile for Seven Bridge Daemon
# This is a reference implementation - adjust for your deployment

FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache \
    bash \
    netcat-openbsd \
    curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install Node.js dependencies
RUN npm ci --production

# Copy application code
COPY src ./src
COPY tsconfig.json ./

# Create runtime directories
RUN mkdir -p /usr/var/seven/{state,logs,audit,checkpoints}

# Copy healthcheck script
COPY docker/healthcheck.sh /usr/local/bin/healthcheck
RUN chmod +x /usr/local/bin/healthcheck

# Environment variables
ENV NODE_ENV=production
ENV SEVEN_SOCKET=/tmp/seven-bridge.sock

# Health check configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD /usr/local/bin/healthcheck

# Expose socket directory as volume (optional)
VOLUME ["/tmp", "/usr/var/seven"]

# Run bridge daemon
CMD ["npm", "run", "seven:daemon"]
