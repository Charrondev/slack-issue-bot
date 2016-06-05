const knex = require('../db');
const gitIcon = "https://github.com/favicon.ico";
const slackIcon = "https://platform.slack-edge.com/img/default_application_icon.png";
const token = require('../tokens').slack;
exports.fixQuotes = (input) => {
  return input.replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201C\u201D]/g, '"');
};

const postMessageFromBot = (bot, channel, text, attachments) => {
  return new Promise((resolve, reject) => {
    const opts = {token, channel, text, attachments,
      as_user: false,
      username: bot.identity.name,
      icon_url: 'https://avatars.slack-edge.com/2016-06-04/48246367489_633e2dadfbf768a3a96b_48.png'}
    bot.api.chat.postMessage(opts, (err, response) => {
      if (err) reject(err);
      resolve(response);
    });
  });
};

exports.postOneIssue = (issue_id, bot, message) => {
    knex('issues')
      .where({
        issue_num: issue_id
      })
      .leftJoin('users', 'issues.author', '=', 'users.id')
      .select('title', 'text','issue_num', 'url', 'is_closed', 'issues.author',
       'users.real_name', 'users.image_url as image_url', 'issues.image_url as git_image_url')
      .then(row => {
          row = row[0];
        row.footer_icon = row.url ? gitIcon : slackIcon;
        row.footer_text = row.url ? 'GitHub' : 'Trackler';
        row.author_icon = row.url ? null : row.image_url;
        row.author_name = row.url ? row.author : row.real_name;
        var reply = {};
        reply.attachments = [{
          title: '#'+row.issue_num+':'+row.title,
          text: row.text,
          author_name: row.author_name,
          author_icon: row.author_icon,
          mrkdwn_in: ["text"],
          footer: row.footer_text,
          footer_icon: row.footer_icon
      }];
        postMessageFromBot(bot, message.channel, '', reply.attachments);
        // bot.reply(message, reply);
      })
      .catch(error => {
        console.log(error);
      });
}

module.exports.extract_number = (string) => {
  var extract = string.match('#[0-9]+');
  if(!extract) return null;
  return extract[0].substring(1)
}
