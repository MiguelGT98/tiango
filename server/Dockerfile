FROM node:alpine

RUN mkdir -p /opt/app/server

WORKDIR /opt/app/server
COPY package.json yarn.lock ./
RUN yarn && yarn cache clean --force

COPY . /opt/app/server

CMD ["yarn", "start"]

EXPOSE 8080