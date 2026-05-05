#
# Multi-stage build for Google Cloud Run (static Vite client)
#
# Build context: ielts-simulator/
#

FROM node:20-alpine AS build

WORKDIR /app

# Install deps first for better layer caching
COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm ci

# Copy source and build
COPY client ./client
RUN cd client && npm run build

# Runtime: nginx serving static files on Cloud Run's port (8080)
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vite is configured to output to ../docs (relative to client/)
COPY --from=build /app/docs/ /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

