FROM node:latest
ENV NODE_ENV = production

ENV APP=/app
RUN mkdir /app
EXPOSE $PORT
COPY . $APP

WORKDIR $APP

RUN yarn global add @adonisjs/cli
RUN yarn

CMD ["adonis", "serve", "--dev"]

