const Botkit = require('botkit');

const setupBot = require('./setup');
const list = require('./listeners/list');
const create = require('./listeners/create');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and port in environment');
  process.exit(1);
}

const controller = Botkit.slackbot({
  json_file_store: './db_slackbutton_slashcommand/',
}).configureSlackApp({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: ['commands'],
});

const bot = controller.spawn({
  token: require('../tokens.js').slack
}).startRTM((err, bot) => {
    if (err) {
    throw new Error('Could not connect to Slack');
  }

  // close the RTM for the sake of it in 5 seconds
  setTimeout(function() {
    bot.closeRTM();
  }, 5000);
});

controller.setupWebserver(process.env.PORT, () => {

  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver, (err,req,res) => {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
});


controller.on('slash_command', (bot, message) => {
    // check message.command
    // and maybe message.text...
    // use EITHER replyPrivate or replyPublic...
    if (message.text === "" || message.text === "help") {
      bot.replyPrivate(message, 'I\'ll help you later');
    }

    let command = message.text.substring(0, message.text.indexOf(' '));
    command = command.length === 0 ? message.text : command;
    const options = message.text.substring(message.text.indexOf(' '));
    console.log(command);
    switch (command) {
      case 'list':
        list(bot, message, options);
        break;
      case 'create':
        create(bot, message, options);
        break;
      default:
        bot.replyPrivate(message, 'I\'ll help you later');
    }
});

setupBot(controller, bot);
