FROM node:12 AS Production

ENV NODE_ENV=production 

WORKDIR /usr/src/server

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . . 

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]