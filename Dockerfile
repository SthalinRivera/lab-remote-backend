# Imagen oficial de Node
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Puerto de tu backend
EXPOSE 3000

# Variables entorno
ENV NODE_ENV=production

# Comando para iniciar
CMD ["npm", "start"]