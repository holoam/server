FROM jubianchi/docker-node-4

ENV NODE_ENV=production

VOLUME /updates

COPY ./index.js /app/index.js
COPY ./package.json /app/package.json

WORKDIR /app
RUN npm install

ENTRYPOINT /node-v4.1.0-linux-x64/bin/node /app/index.js
