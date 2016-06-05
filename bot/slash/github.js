const valid_url = require('valid-url');
const gitUtil = require('./../../github/github_utils');

module.exports = controller => {
  controller.hears(['import'], ['direct_message', 'direct_mention'], (bot, message) => {
    var text = message.text;
    var words = text.split(' ');
    for (var i = 0; i < words.length; i++) {
        words[i].trim();
    }
    if(!valid_url.isUri(words[1])){
        console.log('fail');
        return
    }
    else{
        gitUtil.syncFromGitHub(words[1]);
    }


  });
}
