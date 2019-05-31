FROM node:10.16.0
RUN mkdir -p /usr/src/mhealth
WORKDIR /usr/src/mhealth

COPY package.json /usr/src/mhealth/
RUN npm install
COPY . /usr/src/mhealth

EXPOSE 6000
EXPOSE 6001

ENTRYPOINT  npm run build && npm start

