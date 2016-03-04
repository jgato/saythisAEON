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
var config = require('./config.js');


var control = function control(msg){
    console.log("Control: ", msg);
    subscription = sdk.getSubscription();

}

var received = function received(msg) {
    console.log("Received: ", msg)
}

var subscriptionData = { "id": config.YOUR_ID, "desc": config.YOUR_DESC};

sdk = new AeonSDK(config.SUB_URL, subscriptionData);

sdk.subscribe(received, control);
console.log("Ok, we are subscribed, waiting for messages");








