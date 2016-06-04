const knex = require('../../db');
const _ = require('lodash');

module.exports = (controller, bot) => {
  controller.hears(['list'], ['direct_message', 'direct_mention'], (bot, message) => {
    if (!message.text.startsWith('list')) {
      return;
    };

    const commandProps = processProps(message.text);
    checkDatabase(commandProps)
      .then(rows => {
        const reply = makePosts(rows);
        bot.reply(message, reply);
      })
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
  return knex('issues')
    .select('title', 'text','issue_num', 'url', 'is_closed')
    .where(function() {
      this.where('title', 'like', `%${options.contains}%`)
        .orWhere('text', 'like', `%${options.contains}%`)
    }).orderBy('issue_num')
    .then(rows => {
        const updated = rows.filter(item => item.is_closed === 0 || options.showClosed);
        return updated;
    }).catch(err => {
      console.log(err);
    })
}

function makePosts(rows) {
  const reply = {};
  reply.text = `Issue results:`;
  reply.attachments = rows.map(row => ({
    title: `#${row.issue_num}: ${row.title}`,
    text: row.text,
    color: '#7CD197',
    mrkdwn_in: ["text", "pretext"],
    "footer": "GitHub API",
    "footer_icon": "https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/github-512.png"
  }));
  return reply;
}

function createPost(options) {

}
