FROM node:latest

RUN npm install -g nodemon
RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npm build

CMD "npm" "start"