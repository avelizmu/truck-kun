FROM node:latest
RUN apt-get update
WORKDIR '/app'
COPY . .
RUN npm install
CMD npm run production
