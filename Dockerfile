FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# NGINX
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80, que es el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar el servidor Nginx cuando el contenedor se ejecute
CMD ["nginx", "-g", "daemon off;"]
