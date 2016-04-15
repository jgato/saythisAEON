# saythisAEON

Subscribe to an AEON's entity to say hello to received names. Just playing with docker to deploy containers with Rancher, resin.io, codeship, etc. 

*Important* code based in [text2spech](https://github.com/resin-io/text2speech)

More info about AEON (a Cloud platform for Pub/Sub) [here](https://github.com/atos-ari-aeon/fiware-cloud-messaging-platform).

Data is received in a json like this:

```javascript
{
 "name": "Jose"
}

```

Other different document will say hello to unknown person.

# why this?

Why this "silly" program? Ok, it is just a proof of concept about deploying services, that could be very usefull for IoT environments. This service will allow to execute something in all your "things", by the moment something that say hello to people. It integrates also with AEON, so automatically allows you to have all your "things" integrated in this IoT platform, you see your devices connected.

But how to automatically deploy this service to have your devices "located" in a common platfrom? This is the second part of the experiment, we will use an existing platform called resin.io, but also, we will try to create our own platform using something like rancher for this first stage of deploying services.

# How to use it

Just build and run the container in your host.


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

Then run the container passing the variables: 
``` 
docker run -it \
      -e PULSE_SERVER=tcp:$(hostname -i):4713 \
      -e PULSE_COOKIE_DATA=$(pax11publish -d | grep --color=never -Po '(?<=^Cookie: ).*') \i
      jgato/say-this-aeon 
```

If it is not working, go inside the container and check you have the cookie and the pulse server variables properly configured. In my computer I was having a problem because hostname command returned 127.0.0.1, pointing to this (loopback) address inside the container is not a good way of connectin to the host ;)


## License

Opensource licence Apache, basically do whatever you want with the code ;)
