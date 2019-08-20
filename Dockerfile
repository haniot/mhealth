FROM node:10.16.3

# Create app directory
RUN mkdir -p /usr/src/mhealth
WORKDIR /usr/src/mhealth

# Install app dependencies
COPY package.json /usr/src/mhealth/
RUN npm install

# Copy app source
COPY . /usr/src/mhealth

# Create self-signed certificates
RUN chmod +x ./create-self-signed-certs.sh
RUN ./create-self-signed-certs.sh

# Build app
RUN npm run build

EXPOSE 4000
EXPOSE 4001

CMD ["npm", "start"]
