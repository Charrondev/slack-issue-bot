const knex = require('../../db');
const gitIcon = "https://github.com/favicon.ico";
const slackIcon = "https://platform.slack-edge.com/img/default_application_icon.png";
const util = require('../util');

module.exports = controller => {
  controller.hears(['#[0-9]+'], ['ambient', 'direct_message'], (bot, message) => {
    var text = message.text;
    var issue_id = util.extract_number(text);
    console.log(issue_id);
    util.postOneIssue(issue_id,bot,message);
    console.log('after post');
    if(text.match('/get comments/')){
        console.log('get comments');
    }

  });
}
