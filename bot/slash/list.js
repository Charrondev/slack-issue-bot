const knex = require('../../db');

module.exports = (bot, message, options) => {
  const commandProps = processProps(message.text);
  checkDatabase(commandProps)
    .then(rows => {
      const reply = makePosts(rows);
      bot.replyPrivate(message, reply);
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
    .where(function() {
      this.where('title', 'like', `%${options.contains}%`)
        .orWhere('text', 'like', `%${options.contains}%`)
    })
    .limit(10)
    .leftJoin('users', 'issues.author', '=', 'users.id')
    .select('title', 'text','issue_num', 'url', 'is_closed', 'issues.author',
     'users.real_name', 'users.image_url as image_url', 'issues.image_url as git_image_url')
    .orderBy('issue_num')
    .then(rows => {
      const updated = rows.filter(item => item.is_closed === 0 || options.showClosed);
      return updated;
    }).catch(err => {
      console.log(err);
    })
}

const gitIcon = "https://github.com/favicon.ico";
const slackIcon = "https://platform.slack-edge.com/img/default_application_icon.png";

function makePosts(rows) {
  const reply = {};
  reply.text = `Issue results:`;
  reply.attachments = rows.map(row => {
    row.footer_icon = row.url ? gitIcon : slackIcon;
    row.footer_text = row.url ? 'GitHub' : 'Trackler';
    row.author_icon = row.url ? null : row.image_url;
    row.author_name = row.url ? row.author : row.real_name;
    return {
      title: `#${row.issue_num}: ${row.title}`,
      text: row.text,
      author_name: row.author_name,
      author_icon: row.author_icon,
      mrkdwn_in: ["text"],
      "footer": row.footer_text,
      "footer_icon": row.footer_icon
    };
  });
  return reply;
}
