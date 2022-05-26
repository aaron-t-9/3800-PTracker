FROM node:latest

RUN useradd -m -d /app ptracker


WORKDIR /app
USER ptracker

COPY --chown=ptracker . /app

RUN npm install
RUN npm i nodemon

EXPOSE 3000
CMD ["/bin/sh", "start.sh"]
