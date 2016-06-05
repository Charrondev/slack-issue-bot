const knex = require('../../db');
const {
  fixQuotes
} = require('../util');
const _ = require('lodash');

module.exports = (bot, message, options) => {
  const commandProps = processProps(fixQuotes(options));
  commandProps.author = message.user;
  commandProps.created_at = new Date().getTime() / 1000;
  commandProps.updated_at = commandProps.created_at;
  commandProps.is_closed = 0;

  const askText = commandProps.text.length === 0 ? true : false;
  insertIssue(commandProps)
    .then(id => {
      const text = askText ? `You're issue had no text attatched to it.
      Edit it with /trackle ${id} -text [you're description]` : `Issue #${id} has been submitted.`;
      bot.replyPrivate(message, text);
    }).catch(err => {
      console.error(err);
    });
}

function insertIssue(options) {
  knex('issues')
    .max('id as id')
    .then(max => {
      options.issue_num = max[0].id + 1;
      return knex('issues')
        .insert(_.omit(options, 'includes'))
        .returns('issue_num')
        .then(ids => ids[0])
    }).catch(error => {
      console.error(error);
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
