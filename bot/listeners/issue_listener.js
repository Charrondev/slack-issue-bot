const knex = require('../../db');
const gitIcon = "https://github.com/favicon.ico";
const slackIcon = "https://platform.slack-edge.com/img/default_application_icon.png";
const util = require('../util');

module.exports = controller => {
  controller.hears(['#[0-9]+'], ['ambient', 'direct_message'], (bot, message) => {
    var text = message.text;
    var issue_id = extract_number(text);
    console.log(issue_id);
    util.postOneIssue(issue_id,bot,message);

  });
}

function extract_number(string) {
  var extract = string.match('#[0-9]+');
  return extract[0].substring(1)
}
