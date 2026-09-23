# syntax=docker/dockerfile:1

# ClimaPulse — static frontend served by a tiny Node server.
# The same commands used to run it by hand (npm ci, npm start) drive this image.

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY --from=build /app/node_modules ./node_modules
COPY server.js package.json ./
COPY css ./css
COPY js ./js
COPY *.html ./

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/metrics >/dev/null || exit 1

USER node
CMD ["npm", "start"]