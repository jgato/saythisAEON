# Description


This ghost is part of the [IoT Ghost Platform]() from ATOS. It is intended to be 
basic CORE ghost that needs to run in any IoT device connected to the platform. By
the moment (experimenting/designing phase) it covers really basic functionalities
. It could be even considered as a first hello world, but it makes use of some
basic concepts of the platform, such as using AEON entities for communications 
(ex. heartbeat) and to "encapsulate" applications (ex. greetings). 

What functionalities are covered by the ghost.
 * Subscribe to an AEON's entity to say hello to received names. Greetings application.
 * Publish into an AEON's channel to send like heartbeats. Heartbeat
 
The IoT Ghost Platform is based on docker to deploy ghosts over your connected
IoT devices. So, this ghost has been dockerized.

*Are you wondering what is this AEON?* Basically, **it is a cloud messaging service (pub/sub)**. Try it [here](http://aeon.atosresearch.eu/). If this instance is no longer working contact with the developers for further information and current status of the project: Jose Gato Luis <jose.gato@atos.net>, Javier Garcia <javier.garcia@atos.net>, Elisa Herrmann <elisa.herrmann@atos.net> 

More info about the project [AEON](https://gitlab.atosresearch.eu/ari/aeon-api).

*Important*: I started this ghost using [text2spech](https://github.com/resin-io/text2speech) 
for audio greetings.


## How it works?

The firs time the agent runs, it is registered in a communication channel of the IoT
Ghosts Platform (actually,  subscribed AEON channel) . You will see log like:

```
Ok, it seems this is your first time, lets register your agent into AEON
```

Now it is registered in the platform and it is subscribed in the "Greetings app". When someone publish messages in this channel, these will be received by the ghost.

Data is received/sent in a json like this:

```javascript
{
 "name": "Jose"
}

```
The ghost will say: "hello Jose"

Other different document (other format, incorrect) will say "hello unknown". 

At the same time, the ghost will be publishing heartbeats to the platform (actually,
publishing trough an AEON's channel) sending messages like:

```javascript
{ id: '03f018cd-adb8-45bc-c336-b64c36679bc6',
msg: 'alive',
timestamp: '2016-05-06T11:44:32+02:00' }

```
Anything/anybody subscribed to this last channel (anywhere) will receive heartbeats
from all devices. **An easy/good starting point to have something like your's devices list, with
unique identifiers**

# Benefits

Why this "so simple" ghost? Ok, it is just a proof of concept about deploying services that could be very useful for IoT environments. This service will allow to execute something in all your "things" (maybe 1000 raspberris), by the moment something that say hello to people. Also, It integrates with the
IoT Ghost Platform, so automatically allows you to have all your "things" integrated in this IoT platform, you see your devices connected.


# Technical description 

(how to execute the container)

This container will make use of two channels from the platform. One to receive names for greetings, and other send heartbeats. So it will need to env_variables: SUB_URL_GREETINGS and PUB_URL_HEARTBEAT.

```
docker run -it -e SUB_URL_GREETINGS=http://130.206.113.59:3000/subscribe/e41b319e-506f-4d88-b9d0-e4225b69f8fe \
-e PUB_URL_HEARTBEAT=http://130.206.113.59:3000/publish/f51643b1-9c7f-4c08-9c2d-f396affe5297 \
-e GREETINGS_AUDIO=false \
jgato/say-this-aeon
```

What are these urls I need to run a container? You need to get this urls from the IoT Ghosts Platform
configuration.. You can try these urls in the example, if you are lucky (I didnt delete it).


What if you want to ear in your speakers "hello name", instead of an ugly log? It depends on your device, maybe you only 
need to set GREETINGS_AUDIO=true in a Raspberry. In my laptop, this is more complicated because of the need of sharing the sound card between host and containers. Follow the next instructions and enable the variable GREETINGS_AUDIO=true

### Accessing sound card inside the container

Depending on your OS/distribution you will find problems accessing the sound card inside the container. I have found some instructions about how to proceed. It seems the problem is a conflict between pulseaudio in the host and container, so you have to share pulseaudio in your host:



Install PulseAudio Preferences. Debian/Ubuntu users can do this:

```
    $ sudo apt-get install paprefs
```

Launch paprefs (PulseAudio Preferences) > "Network Server" tab > Check "Enable network access to local sound devices" (you may check "Don't require authentication" to avoid mounting cookie file described below).

Restart PulseAudio

```
    $ sudo service pulseaudio restart
```

or

``` 
    $ pulseaudio -k
    $ pulseaudio --start
```

On some distributions, it may be necessary to completely restart your computer. You can confirm that the settings have successfully been applied running pax11publish | grep -Eo 'tcp:[^ ]*'. You should see something like tcp:myhostname:4713.

Now you can run the container but you will need the ip address of your host, where pulseaudio server is running. This command should help you with that, but you need to know the name of your interface. In **ubuntu** usually eno1:

```
ifconfig eno1 | grep "inet addr" | awk -F: '{print $2}' | awk '{print $1}'

```


**Running in ubuntu**

``` 
docker run -it \
-e SUB_URL_GREETINGS=http://130.206.113.59:3000/subscribe/e41b319e-506f-4d88-b9d0-e4225b69f8fe \
-e PUB_URL_HEARTBEAT=http://130.206.113.59:3000/publish/f51643b1-9c7f-4c08-9c2d-f396affe5297 \
      -e GREETINGS_AUDIO=true \
      -e PULSE_SERVER=tcp:`ifconfig eno1 | grep "inet addr" | awk -F: '{print $2}' | awk '{print $1}'`:4713 \
      -e PULSE_COOKIE_DATA=$(pax11publish -d | grep --color=never -Po '(?<=^Cookie: ).*') \
      jgato/say-this-aeon 
```

As you can see now you are enabling audio with GREETINGS_AUDIO=true. It also needs the SUB_URL, it is mandatory (or at least the first time you run the container).

**Other distros** just change the interface to guess the host IP address. 


If it is not working, go inside the container and check you have the cookie and the pulse server variables properly configured. In my computer I was having a problem because hostname command returned 127.0.0.1, pointing to this (loopback) address inside the container is not a good way of connecting to the host ;)

# In use


# License

Opensource licence Apache v2
