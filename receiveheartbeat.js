/**
  Copyright (C) 2014 ATOS

    This file is part of AEON.

    AEON is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    AEON is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with AEON.  If not, see <http://www.gnu.org/licenses/>.

  Authors:
    Javier Garcia <javier.garcia@atos.net>
    Jose Gato Luis <jose.gato@atos.net>


  */

//var AeonSDK = require('../lib/aeonSDK.js');
var AeonSDK = require('aeonsdk-node');
var colog = require('colog');

var effects= [ 'bold', 'underline', 'strike', 'inverse' ] ;
var colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

var ids = {};

var control = function control(msg){
  console.log("Control: ", msg);
}

var received = function received(msg) {
  var format = ids[msg.id];

  if (!format) {
    console.log("new id");
    ids[msg.id] = getFormat();
    format = ids[msg.id];
  }
    
  console.log("Device id ", colog.apply(msg.id, format), " msg ", msg.msg, " timestamp ", msg.timestamp);
};


var random = function random(high, low){
  return Math.floor(Math.random() * (high - low + 1) + low);
}
var getColor = function getColor(){
  return colors[random(6,0)];
}

var getEffect = function getEffect(){
  return effects[random(3,0)];
}

var getFormat = function getFormat(){
  
  return [getColor(), getEffect()]
}

if (process.argv.length != 3) {
  console.log("Usage: node.js receiveheartbeat.js sub_url_heartbeat");
  return;
}

subscriptionData = {
  "id": "testing receive heartbeat",
  "desc": "testing receive heartbeat"
};

sdk = new AeonSDK(process.argv[2], subscriptionData);
sdk.subscribe(received, control);



