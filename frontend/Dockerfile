FROM node:latest

ARG BACKEND_ENDPOINT
ENV BACKEND_ENDPOINT=$BACKEND_ENDPOINT

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD "npm" "start"