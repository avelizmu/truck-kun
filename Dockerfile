FROM node:latest
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y ffmpeg
WORKDIR '/app'
COPY . .
RUN npm install
RUN npm install @discordjs/opus
CMD npm run production
