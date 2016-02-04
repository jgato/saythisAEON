var say = require('say');

var text = process.env.TEXT || 'Say hello Jose Gato';

say.speak(null, text);
