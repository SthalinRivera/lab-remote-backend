# Imagen oficial de Node
FROM node:20-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar proyecto
COPY . .

# Puerto del backend
EXPOSE 4000

# Producción
ENV NODE_ENV=production

# Iniciar app
CMD ["npm", "start"]