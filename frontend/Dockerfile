# Build context esperado: frontend/
FROM node:22-alpine AS build
WORKDIR /app
# URL del backend horneada en el build. Por defecto el gateway local (compose de desarrollo).
# En produccion se pasa API_BASE="" para que el navegador llame a /api en el mismo dominio (Caddy).
ARG API_BASE=http://localhost:8080
COPY package*.json ./
RUN npm ci
COPY . .
RUN sed -i "s#export const API_URL = .*#export const API_URL = '${API_BASE}';#" src/app/core/api.config.ts
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
