const Botkit = require('botkit');
const path = require('path');

const controller = Botkit.slackbot({
  debug:true
});

controller.spawn({
  token: require('../tokens.js').slack
}).startRTM();

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.reply('hello');
});
