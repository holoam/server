FROM jubianchi/docker-node-4

ENV NODE_ENV=production

VOLUME /updates

COPY ./ /app
COPY ./package.json /app/package.json

WORKDIR /app
RUN npm install

ENTRYPOINT /node-v4.1.0-linux-x64/bin/npm start
