FROM node:latest

WORKDIR /app

COPY package.json ./

RUN npm install; \
    npm i nodemon;

COPY . ./

EXPOSE 3000

CMD ["/bin/bash", "start.sh"]
