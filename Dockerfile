FROM node:10.15.3

# create and set app directory
RUN mkdir -p /usr/src/mhealth
WORKDIR /usr/src/mhealth

# install app dependencies
COPY package.json /usr/src/mhealth/
RUN npm install
COPY . /usr/src/mhealth

EXPOSE 6000
EXPOSE 6001

ENTRYPOINT  npm run build && npm start
