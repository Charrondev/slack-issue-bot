const Botkit = require('botkit');
const path = require('path');

const setupBot = require('./setup');

const controller = Botkit.slackbot({
  debug:false
});

const bot = controller.spawn({
  token: require('../tokens.js').slack
}).startRTM();

setupBot(controller, bot);
