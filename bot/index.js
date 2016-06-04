const Botkit = require('botkit');
const path = require('path');
const knex = require('../db');

const setupBot = require('./setup');
const listCommand = require('./listeners/list');

const controller = Botkit.slackbot({
  debug:false
});

const bot = controller.spawn({
  token: require('../tokens.js').slack
}).startRTM();

setupBot(controller, bot);
listCommand(controller, bot);
