FROM ubuntu:14.04

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# installing the stuff
RUN apt-get update && apt-get install -y \
	nodejs \
	npm \
	alsa-utils \
	libasound2-dev \
	festival \
	festvox-kallpc16k \
	pulseaudio

COPY package.json /usr/src/app/
RUN npm config set strict-ssl false
RUN npm install

RUN ln -s /usr/bin/nodejs /usr/bin/node

# Bundle app source
COPY . /usr/src/app
RUN echo '{}' > /usr/src/app/config.json

CMD [ "npm", "start" ]

