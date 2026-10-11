FROM node:22-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias de producción de forma robusta
RUN npm install --omit=dev --no-audit --no-fund

# Copiar código del servidor
COPY server/ ./server/

# Variables de entorno por defecto
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

# Arrancar el servidor en 0.0.0.0
CMD ["node", "server/index.js"]
