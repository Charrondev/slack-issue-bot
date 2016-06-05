const knex = require('../../db');

module.exports = (controller, bot) => {
  controller.hears(['view'], ['direct_message', 'direct_mention'], (bot, message) => {

      if (!message.text.startsWith('list')) {
        return;
      }

    // check issue number

    // post

    // Start conversation

    //
  });
}
