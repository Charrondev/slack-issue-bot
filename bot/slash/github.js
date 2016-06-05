const valid_url = require('valid-url');
const gitUtil = require('./../../github/github_utils');

module.exports = (bot, message, options) => {
    if(!valid_url.isUri(options.trim())){
        bot.replyPrivate(message, `That is not a valid repository`);
    } else gitUtil.syncFromGitHub(options.trim())
            .then(() => {
              bot.replyPrivate(message, `Succesfully imported issues`);
            }).catch((err) => {
              console.log(err);
            });
}
