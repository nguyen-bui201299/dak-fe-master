#build
FROM node:16.15-alpine

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node . .

RUN npm i --force

CMD ["node", "server.js"]