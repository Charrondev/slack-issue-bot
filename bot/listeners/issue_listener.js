const knex = require('../../db');
const gitIcon = "https://github.com/favicon.ico";
const slackIcon = "https://platform.slack-edge.com/img/default_application_icon.png";
const util = require('../util');

module.exports = controller => {
  controller.hears(['#[0-9]+'], ['ambient', 'direct_message'], (bot, message) => {
    var text = message.text;
    var issue_id = util.extract_number(text);
    console.log(issue_id);
    util.postOneIssue(issue_id, bot, message);

    console.log(text.match(/get\s*comments/));
    if (text.match(/get\s*comments/)) {
      console.log('get comments');
      knex('comment')
        .leftJoin('users', 'comment.user_id', '=', 'users.id')
        .select()
        .where({
          issue_id: issue_id
        })
        .orderBy('posted_at')
        .then(rows => {
          console.log(rows);
          var comments = {};
          comments.text = 'Comments:';
          comments.attachments = rows.map(row => {
            return {
              text: row.text,
              author_name: row.username
            }
          });
          util.postMessageFromBot(bot,message.channel,comments.text,comments.attachments);
        })
        .catch(error => {
          console.log(error);
        })
    } else console.log('no comments');

  });
}
