# Front PokeQuizz-Dex : build Angular puis service des fichiers statiques par nginx.
# Les appels /api, /hubs et /Content sont relayés vers l'API par le reverse proxy (Caddy), sur le même domaine.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Configuration "production" : adresses relatives (même domaine que l'API)
RUN printf '{\n  "env": "production"\n}\n' > src/assets/env/env.json \
 && npx ng build --configuration production

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/PokeQuizz-Dex/browser /usr/share/nginx/html
EXPOSE 80
