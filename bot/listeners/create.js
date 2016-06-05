const knex = require('../../db');
const {
  fixQuotes
} = require('../util');
const _ = require('lodash');
const convoQuestion1 = `You didn't give you're error a description. If you would like to, do so now. Otherwise just say no.`;

module.exports = controller => {
  controller.hears(['create'], ['direct_message', 'direct_mention'], (bot, message) => {
    if (!message.text.startsWith('create')) {
      return;
    }

    const commandProps = processProps(fixQuotes(message.text));
    commandProps.author = message.user;
    commandProps.created_at = new Date().getTime() / 1000;
    commandProps.updated_at = commandProps.created_at;
    commandProps.is_closed = 0;

    const askText = commandProps.text.length === 0 ? true : false;

    bot.startConversation(message, (err, convo) => {
      if (askText) {
        convo.ask(convoQuestion1, [
          {
            pattern: bot.utterances.no,
            callback: (response, convo) => {
              convo.next();
            }
          }, {
            default: true,
            callback: (response, convo) => {
              commandProps.text = response.text;
              convo.next();
            }
          }
        ]);
      }
    });

    knex('issues')
      .max('id as id')
      .then(max => {
        commandProps.issue_num = max[0].id + 1;
        return knex('issues')
          .insert(_.omit(commandProps, 'includes'))
          .then(ids => {
            bot.reply(`Issue #${ids[0]} has been submitted`);
          });
      }).catch(error => {
        console.error(error);
      });


  });
}


// Check inputs of the text for correctness
function processProps(input) {
  const options = {
    title: '',
    text: '',
    includes: []
  };

  const title = input.match(/"(.*?)"/);
  if (title) {
    options.title = title[1];
    input = input.replace(title[0], '');
  }

  const includes = input.match(/<(.*?)>/g);
  if (includes) {
    options.includes = includes.map(include => include.replace(/include|@|>|</g, '').trim());
  }

  const commands = input
    .replace('create', '')
    .trim()
    .split('-');

  // deal with other options
  commands.forEach(item => {
    if (item.startsWith('include')) {
      options.includes = item.replace(/include|@|>|</g, '')
        .split(',')
        .map(username => username.replace('@', '').trim());
    }
    if (item.startsWith('text')) {
      options.text = item.replace('text', '').trim();
    }
  });

  return options;
}
