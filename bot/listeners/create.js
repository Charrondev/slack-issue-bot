const knex = require('../../db');
const {
  fixQuotes
} = require('../util');
const _ = require('lodash');

module.exports = (controller, bot) => {
  controller.hears(['create'], ['direct_message', 'direct_mention'], (bot, message) => {
    if (!message.text.startsWith('create')) {
      return;
    };

    const commandProps = processProps(fixQuotes(message.text));
    commandProps.author = message.user;
    commandProps.created_at = new Date().getTime() / 1000;
    commandProps.updated_at = commandProps.created_at;
    commandProps.is_closed = 0;

    const includes = commandProps.includes;

    const askIncludes = commandProps.includes.length === 0 ? true : false;
    const askText = commandProps.text.length === 0 ? true : false;


    knex('issues')
      .max('id as id')
      .then(max => {
        console.log(max);
        commandProps.issue_num = max[0].id + 1;
        return knex('issues')
          .insert(_.omit(commandProps, 'includes'));
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

  const matched = input.match(/"(.*?)"/);
  if (matched !== null) {
    options.title = matched[1];
    input = input.replace(matched[0], '');
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
