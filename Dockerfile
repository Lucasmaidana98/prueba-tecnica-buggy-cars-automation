# Dockerfile para Automatización de Pruebas Buggy Cars
FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="Automatización Senior <senior@testing.com>"
LABEL description="Contenedor Docker para pruebas automatizadas de Buggy Cars Rating"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    firefox \
    wget \
    curl \
    bash \
    git \
    openjdk11-jre

# Configurar variables de entorno para Chrome
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/bin/chromium-browser \
    CHROME_DRIVER=/usr/bin/chromedriver \
    DISPLAY=:99

# Crear directorio de trabajo
WORKDIR /app

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copiar archivos de configuración
COPY package*.json ./
COPY wdio*.config.js ./

# Instalar dependencias de Node.js con timeout extendido
RUN npm config set timeout 300000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --timeout=300000

# Copiar el resto del código
COPY . .

# Crear directorios necesarios
RUN mkdir -p logs screenshots allure-results && \
    chown -R nextjs:nodejs /app

# Cambiar al usuario no root
USER nextjs

# Exponer puerto para reportes
EXPOSE 4444

# Comando por defecto
CMD ["npm", "test"]

# Comandos adicionales disponibles:
# docker run -it --rm -v $(pwd)/screenshots:/app/screenshots automatizacion-buggy-cars npm run test:chrome
# docker run -it --rm -v $(pwd)/logs:/app/logs automatizacion-buggy-cars npm run test:reporte