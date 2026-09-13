# Étape 1 : Utiliser une image Node stable et légère
FROM node:20-alpine

WORKDIR /app

# Copier uniquement les fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port par défaut de Vite
EXPOSE 5173

# Lancer Vite en mode développement avec l'option --host pour être accessible depuis l'extérieur du conteneur
CMD ["npm", "run", "dev", "--", "--host"]