# ============================================================
# Stage 1: build React
# ============================================================
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Здесь /app/dist содержит собранную SPA


# ============================================================
# Stage 2: runtime nginx
# ============================================================
FROM nginx:1.27-alpine

# Меняем владельца директорий на uid 101 (nginx в alpine)
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    sed -i 's/user  nginx;//' /etc/nginx/nginx.conf

# Слушаем порт > 1024, чтобы non-root мог
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf || true

# Конфиг nginx (твой)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Статика из стадии build
COPY --from=build /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]