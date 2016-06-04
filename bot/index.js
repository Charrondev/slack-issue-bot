const Botkit = require('botkit');
const path = require('path');

const controller = Botkit.slackbot({
  debug:true
});

controller.spawn({
  token: require('../tokens.js').slack
}).startRTM();

controller.hears(['Fucker'], ['message_received', 'direct_message'],(bot, message) => {

  bot.reply(message, 'Dont swear');
});
