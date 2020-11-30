FROM node:alpine

RUN mkdir -p /opt/app/server

WORKDIR /opt/app/server
COPY package.json yarn.lock /opt/app/server/

RUN ls

RUN yarn && yarn cache clean --force

COPY . /opt/app/server

RUN ls

CMD ["yarn", "start"]

EXPOSE 8080