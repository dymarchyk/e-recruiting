FROM node:latest
ENV NODE_ENV = production

ENV APP=/app
RUN mkdir /app

COPY . $APP

WORKDIR $APP

RUN yarn global add @adonisjs/cli
RUN yarn
RUN yarn build
EXPOSE $PORT
CMD ["adonis", "serve", "--dev"]

