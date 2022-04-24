FROM node:14.17.0 

WORKDIR /distribute-confirm-service

COPY . /distribute-confirm-service

RUN yarn install && yarn build

ENTRYPOINT [ "yarn", "start"]
