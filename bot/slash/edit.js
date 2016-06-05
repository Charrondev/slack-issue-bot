const knex = require('../../db');
const {
  fixQuotes
} = require('../util');
const _ = require('lodash');

module.exports = (bot, message, options) => {
  const commandProps = processProps(fixQuotes(message.text), message.user_name);
  commandProps.updated_at = new Date().getTime() / 1000;

  updateIssue(commandProps)
    .then(id => {
      const text = `Issue #${id} has been updated.`;
      bot.replyPrivate(message, text);
    }).catch(err => {
      console.error(err);
    });
}

function updateIssue(options) {
  return knex('issues')
    .where({issue_num: options.issue_num})
    .update(_.omit(options, 'includes'))
    .returning('id')
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

}


// Check propss of the text for correctness
function processProps(props, username) {
  const options = {
    includes: [],
    is_closed: false
  };

  const numbers = props.match(/^#[0-9]+\s?/);
  options.issue_num = parseInt(numbers[0].replace('#', ''));
  const title = props.match(/"(.*?)"/);
  if (title) {
    options.title = title[1];
    props = props.replace(title[0], '');
  }

  const includes = props.match(/@.+/g);
  if (includes) {
    options.includes = includes.map(include => include.replace(/include|@|>|</g, '').trim());
  }
  options.includes.push(username);
  console.log(options.includes);

  const commands = props
    .trim()
    .split('-');

  // deal with other options
  commands.forEach(item => {
    if (item.startsWith('text')) {
      options.text = item.replace('text', '').trim();
    }
    if (item.startsWith('close')) {
      options.is_closed = true;
    }
  });

  return options;
}
