FROM ubuntu:14.04

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# installing the stuff
RUN apt-get update
RUN apt-get install -y nodejs npm

COPY package.json /usr/src/app/
RUN npm install

RUN apt-get install -y alsa-utils libasound2-dev festival festvox-kallpc16k
RUN alias node='nodejs'

# Bundle app source
COPY . /usr/src/app

CMD [ "nodejs", "server.js" ]

