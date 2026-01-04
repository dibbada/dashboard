# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY .  .

# Build frontend
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server code
COPY server ./server

EXPOSE 3001

# Build and run server
WORKDIR /app/server
RUN npm run build
CMD ["npm", "start"]
