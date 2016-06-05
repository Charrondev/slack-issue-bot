const Botkit = require('botkit');
const knex = require('../db');

const controller = Botkit.slackbot({
  debug:false
});

const bot = controller.spawn({
  token: require('../tokens.js').slack
}).startRTM();
