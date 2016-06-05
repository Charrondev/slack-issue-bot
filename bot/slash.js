const Botkit = require('botkit');

const setupBot = require('./setup');
const list = require('./slash/list');
const create = require('./slash/create');
const edit = require('./slash/edit');
const github = require('./slash/github');

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
    // setupBot(controller, bot);

    // check message.command
    // and maybe message.text...
    // use EITHER replyPrivate or replyPublic...
    if (message.text === "" || message.text === "help") {
      bot.replyPrivate(message, 'I\'ll help you later');
    }

    let command = message.text.substring(0, message.text.indexOf(' '));
    command = command.length === 0 ? message.text : command;
    const options = message.text.substring(message.text.indexOf(' '));
    switch (command) {
      case 'list':
        list(bot, message, options);
        break;
      case 'create':
        create(bot, message, options);
        break;
      case 'import':
        github(bot, message, options);
        break;
      default:
        if (command.match(/^#[0-9]+\s?/)) edit(bot, message, options);
        else bot.replyPrivate(message, 'I\'ll help you later');
    }
});
