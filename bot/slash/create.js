const knex = require('../../db');
const {
  fixQuotes
} = require('../util');
const _ = require('lodash');

module.exports = (bot, message, options) => {
  const commandProps = processProps(fixQuotes(options), message.user_name);
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
  return knex('issues')
    .max('issue_num as id')
    .then(max => {
      options.issue_num = max[0].id + 1;
      return knex('issues')
        .insert(_.omit(options, 'includes'))
        .returning('issue_num')
        .then(issue_id => {
          return knex('users')
            .whereIn('username', options.includes)
            .select('id')
            .then(rows => rows.map(row => ({
                issue_id,
                user_id: row.id
              }))
            );
        }).then(rows => knex('follower')
            .insert(rows)
            .returning('issue_id')
          );
      });
}


// Check inputs of the text for correctness
function processProps(input, username) {
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

  const includes = input.match(/@.+/g);
  if (includes) {
    options.includes = includes.map(include => include.replace(/include|@|>|</g, '').trim());
  }
  options.includes.push(username);

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
