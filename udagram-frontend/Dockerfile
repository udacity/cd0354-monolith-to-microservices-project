## Construire
FROM beevelop/ionic:latest AS ionic

## Créer le répertoire de l'application
WORKDIR /usr/src/app

# Installer les dépendances de l'application
# Un joker est utilisé pour s'assurer que package.json ET package-lock.json sont copiés.
COPY package*.json ./

#Install dependencies
RUN npm ci 

# Regroupement des sources de l'application
COPY . .

#Build app
RUN ionic build --prod	


#Exécuter
FROM nginx:alpine

#COPY www /usr/share/nginx/html
COPY --from=ionic /usr/src/app/www /usr/share/nginx/html

#Setup custom config for nginx
COPY --from=ionic /usr/src/app/nginx/nginx-custom.conf /etc/nginx/conf.d/default.conf
