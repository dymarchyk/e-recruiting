FROM node:latest

ENV HOME=/app
RUN mkdir /app

COPY . $HOME

WORKDIR $HOME

RUN yarn global add @adonisjs/cli
RUN yarn
RUN yarn build
CMD ["adonis", "serve", "-p"]

