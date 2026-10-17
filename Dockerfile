# --- Étape 1 : Build de l'application React avec Vite ---
FROM node:20-alpine AS builder

WORKDIR /app

# Déclarer qu'on attend cette variable au build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Étape 2 : Serveur Nginx léger pour la production ---
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
