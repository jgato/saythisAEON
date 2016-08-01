# saythisAEON

** I consider the experiment finished, I will continue it as an internal project with other different objectives **

Subscribe to an AEON's entity to say hello to received names. Publish into an AEON's channel to send like heartbeats. Just playing with docker to deploy containers with Rancher, resin.io, codeship, etc. 

Are you wondering what is this AEON? Basically, **it is a cloud messaging service (pub/sub)**. Try it [here](http://130.206.116.137:8000/). If this instance is no longer working contact with the developers for further information and current status of the project: Jose Gato Luis <jose.gato@atos.net>, Javier Garcia <javier.garcia@atos.net>, Elisa Herrmann <elisa.herrmann@atos.net> 

More info about the project [here](https://gitlab.atosresearch.eu/ari/aeon-api).

*Important*: I started using [text2spech](https://github.com/resin-io/text2speech) for audio.


## How it works?

The firs time, the agent is registered in a communication channel of the AEON's platform (it is subscribed). You will see log like:

```
Ok, it seems this is your first time, lets register your agent into AEON
```

Now it is registered in AEON and it is subscribed in the "Greetings app". When someone publish messages in this channel, these will be received by the agent.

Data is received/sent in a json like this:

```javascript
{
 "name": "Jose"
}

```
The agent will say: "hello Jose"

Other different document (other format, incorrect) will say "hello unknown". Easy, right?

At the same time, the agent is publishing in a HeartBeats channel sending messages like:

```javascript
{ id: '03f018cd-adb8-45bc-c336-b64c36679bc6',
msg: 'alive',
timestamp: '2016-05-06T11:44:32+02:00' }

```
You could subscribe in this channel (anywhere) to control your devices.


# why this?

Why this "so simple" program? Ok, it is just a proof of concept about deploying services, that could be very useful for IoT environments. This service will allow to execute something in all your "things" (maybe 1000 raspberris), by the moment something that say hello to people. It integrates also with AEON, so automatically allows you to have all your "things" integrated in this IoT platform, you see your devices connected.

But how to automatically deploy this service to have your devices "located" in a common platform? This is the second part of the experiment, we will use an existing platform called resin.io, but also, we will try to create our own platform using something like rancher for this first stage of deploying services.

# How to use it

This container will make use of two channels. One to receive names for greetings, and other send heartbetas. So it will need to env_variables: SUB_URL_GREETINGS and PUB_URL_HEARTBEAT.

```
docker run -it -e SUB_URL_GREETINGS=http://130.206.113.59:3000/subscribe/e41b319e-506f-4d88-b9d0-e4225b69f8fe \
-e PUB_URL_HEARTBEAT=http://130.206.113.59:3000/publish/f51643b1-9c7f-4c08-9c2d-f396affe5297 \
-e GREETINGS_AUDIO=false \
jgato/say-this-aeon
```

What are these urls I need to run a container? See AEON's documentation about creating a [communication channel](http://130.206.116.137:3000/public/doc/html/quickstart/getachannel.html#documentation-tutorial-getchannel). You can try these urls in the example, if you are lucky (I didnt delete it) you can use it.


What if you want to ear in your speakers "hello name"? This is more complicated because of the need of sharing the sound card between host and containers. Follow the next instructions and enable the variable GREETINGS_AUDIO=true

## Accessing sound card inside the container

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


## License

Opensource licence Apache v2
