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

var control = function control(msg) {
  console.log("Control: ", msg);
  subscription = sdk.getSubscription();

};

var received = function received(msg) {
  console.log("Received: ", msg);
  if (msg.name) {
    console.log("hello ", msg.name);
    say.speak(null, "hello " + msg.name);
  } else {
    console.log("hello unknown");
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

  client.get(config.SUB_URL + "?id=" + id + "&desc=" + desc, function (data, response) {


    if (response.statusCode == 200) {
      next(data);
    } else {
      next(null);
    }

  });
}

var subscribeMe = function subscribeMe(subscriptionData) {

  sdk = new AeonSDK(config.SUB_URL, subscriptionData);

  sdk.subscribe(received, control);
  console.log("Ok, we are subscribed, waiting for messages");


}


client = new Client();

if (config.YOUR_ID === "" || config.YOUR_ID === null) {
  console.log("Ok, it seems this is your first time, lets register your agent \
              AEON");

  registerAgent(function (registerData) {

    if (registerData === null) {
      console.log("Error registering agent");
      return;
    } else {
      config.YOUR_ID = registerData.result[0].id;
      config.YOUR_DESC = registerData.result[0].desc;

      fs.writeFile('./config.json', JSON.stringify(config), function (err) {
        if (err) {
          console.log('There has been an error saving your configuration data.');
          console.log(err.message);
          return;
        }
        console.log('Configuration saved successfully.')
      });

      console.log(config);
      subscriptionData = {
        "id": config.YOUR_ID,
        "desc": config.YOUR_DESC
      };
      subscribeMe(subscriptionData);
    }

  });


} else {

  subscriptionData = {
    "id": config.YOUR_ID,
    "desc": config.YOUR_DESC
  };

  subscribeMe(subscriptionData);
}
