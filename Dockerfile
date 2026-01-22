FROM node:20-alpine AS builder

WORKDIR /app

COPY college_management_system/package*.json ./college_management_system/

RUN cd college_management_system && \
    npm ci && \
    find node_modules/.bin -type f -exec chmod +x {} \;

COPY college_management_system/ ./college_management_system/

RUN cd college_management_system && \
    node node_modules/vite/bin/vite.js build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/college_management_system/dist /usr/share/nginx/html/app

COPY index.html /usr/share/nginx/html/
COPY login.html /usr/share/nginx/html/
COPY register.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY events.html /usr/share/nginx/html/
COPY create-event.html /usr/share/nginx/html/
COPY profile.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
