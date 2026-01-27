# ========================================
# Stage 1: Build
# ========================================
FROM node:18-alpine AS build

# Metadata
LABEL maintainer="Harry Potter WebApp"
LABEL description="Aplicación React del universo Harry Potter - Build stage"

# Directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
# --legacy-peer-deps por compatibilidad
RUN npm ci --legacy-peer-deps --production=false

# Copiar código fuente
COPY . .

# Variables de entorno para build
# Estas se pueden sobrescribir en docker-compose
ARG REACT_APP_CAT_API_KEY
ENV REACT_APP_CAT_API_KEY=$REACT_APP_CAT_API_KEY

# Build de producción
RUN npm run build

# ========================================
# Stage 2: Production
# ========================================
FROM nginx:alpine

# Metadata
LABEL maintainer="Harry Potter WebApp"
LABEL description="Aplicación React del universo Harry Potter - Production"

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build desde stage anterior
COPY --from=build /app/build /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
