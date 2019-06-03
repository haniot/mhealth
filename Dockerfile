FROM node:10.15.3

# Create app directory
RUN mkdir -p /usr/src/mhealth
WORKDIR /usr/src/mhealth

# Install app dependencies
COPY package.json /usr/src/mhealth/
RUN npm install

# Bundle app source
COPY . /usr/src/mhealth
RUN npm run build

EXPOSE 4000
EXPOSE 4001

CMD ["npm", "start"]