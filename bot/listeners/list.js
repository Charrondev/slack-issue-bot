const knex = require('../../db');
const _ = require('lodash');

module.exports = (controller, bot) => {
  controller.hears(['list'], ['direct_message', 'direct_mention'], (bot, message) => {
    if (!message.text.startsWith('list')) {
      return;
    };

    const commandProps = processProps(message.text);

  });
}

function processProps(input) {
  const options = {
    showClosed: false,
    showOpen: true,
    labels: [],
    contains: ""
  };

  const commands = input
                    .replace('list', '')
                    .trim()
                    .split('-');
  // deal with open / closed
  commands.forEach(item => {
    if (item.startsWith('closed')) options.showClosed = true;
    if (item.startsWith('open')) options.showOpen = true;
    if (item.startsWith('labels')) {
       options.labels = item.replace('labels', '')
                        .trim()
                        .split(',');
    }
    if(item.startsWith('contains')) {
      options.contains = item.replace('contains', '').trim();
    }
  });

  return options;
}

function checkDatabase(options) {
  // return knex('issue').
}

function createPost(options) {

}
