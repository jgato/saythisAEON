/**
  Copyright (C) 2016 ATOS

    
    This is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License.
    If not, see <http://www.gnu.org/licenses/>.

  Authors:
    Jose Gato Luis <jose.gato@atos.net>

  */


//var AeonSDK = require('../lib/aeonSDK.js');
var AeonSDK = require('aeonsdk-node');
var config = require('./config.json');
var Client = require('node-rest-client').Client;
var say = require('say');
var fs = require('fs');
var moment = require('moment-timezone');

var control = function control(msg) {
  if (msg.code == 250)
    console.log("Ok, we are subscribed, waiting for messages");
};

var received = function received(msg) {
  if (msg.name) {
    console.log("hello ", msg.name);
    if (audioEnabled)
      say.speak(null, "hello " + msg.name);
  } else {
    console.log("hello unknown");
    if (audioEnabled)
      say.speak(null, "hello unknown");
  }
};

var generateUUID = function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
};


var registerAgent = function registerAteng(next) {

  var id = generateUUID();
  var desc = "say this aeon agent " + id;

  client.get(config.SUB_URL_GREETINGS + "?id=" + id + "&desc=" + desc, function (data, response) {


    if (response.statusCode == 200) {
      next(data);
    } else {
      next(null);
    }

  });
}

var sendHeartBeat = function sendHeartBeat(next) {
  var heartBeatMsg = {
    'id': config.YOUR_ID,
    'msg': 'alive',
    'timestamp': moment(Date.now()).tz("Europe/Madrid").format()
  }

  var args = {
    data: heartBeatMsg,
    headers: {
      "Content-Type": "application/json",
    }
  };

  client.post(config.PUB_URL_HEARTBEAT, args, function (data, response) {
    // parsed response body as js object 
    if (response.statusCode == 200) {
      next(true);
    } else {
      next(false);
    }

  });

}
var heartBeatTimer = function heartBeatTimer() {

  setInterval(function () {
    sendHeartBeat(function (status) {
      console.log("heartbeat send it ", status)
    });
  }, 5000)

}

var subscribeMe = function subscribeMe(subscriptionData) {

  sdk = new AeonSDK(config.SUB_URL_GREETINGS, subscriptionData);
  sdk.subscribe(received, control);

}

var saveConfig = function saveConfig() {
  fs.writeFile('./config.json', JSON.stringify(config), function (err) {
    if (err) {
      console.log('There has been an error saving your configuration data.');
      console.log(err.message);
      return;
    }
  });
}

/*
 * Checkingj env variables
 */
 
if (process.env.SUB_URL_GREETINGS)
  config.SUB_URL_GREETINGS = process.env.SUB_URL_GREETINGS;
else if (!config.SUB_URL_GREETINGS) {
  console.log("Error no SUB_URL_GREETINGS, check config.json or set SUB_URL_GREETINGS env variable");
  return;
}

if (process.env.PUB_URL_HEARTBEAT)
  config.PUB_URL_HEARTBEAT = process.env.PUB_URL_HEARTBEAT;
else if (!config.PUB_URL_HEARTBEAT) {
  console.log("Error no PUB_URL_HEARTBEAT, check config.json or set PUB_URL_HEARTBEAT env variable");
  return;
}

var audioEnabled = false;

if (process.env.GREETINGS_AUDIO && process.env.GREETINGS_AUDIO == "true")
  audioEnabled = true;
else
  console.log("No audio enabled, only text mode. See instructions to enable audio");

client = new Client();

if (!config.YOUR_ID || config.YOUR_ID === "" || config.YOUR_ID === null) {
  console.log("Ok, it seems this is your first time, lets register your agent \
              AEON");

  registerAgent(function (registerData) {

    if (registerData === null) {
      console.log("Error registering agent");
      return;
    } else {
      config.YOUR_ID = registerData.result[0].id;
      config.YOUR_DESC = registerData.result[0].desc;

      subscriptionData = {
        "id": config.YOUR_ID,
        "desc": config.YOUR_DESC
      };
      subscribeMe(subscriptionData);
      heartBeatTimer();
      saveConfig();
    }

  });


} else {

  subscriptionData = {
    "id": config.YOUR_ID,
    "desc": config.YOUR_DESC
  };

  subscribeMe(subscriptionData);
  heartBeatTimer();
  saveConfig();
}
