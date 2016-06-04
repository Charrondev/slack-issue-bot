var GitHubApi = require('github');
var knex = require('../db');

var github = new GitHubApi({
  debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  //pathPrefix: "/api/v3", // for some GHEs; none for GitHub
  timeout: 5000,
  headers: {
    "user-agent": "SlackTracker" // GitHub is happy with a unique user agent
  }

});

function fetchIssues(user, repo) {
  return new Promise((resolve, reject) => {
    github.issues.getForRepo({
      user,
      repo
    }, (err, res) => {
      if (err) reject(err);
      const issues = res.map(element => ({
        title: element.title,
        author: element.user.login,
        url: element.html_url,
        issue_num: element.number,
        text: element.body,
        created_at: element.created_at,
        updated_at: element.updated_at
      }));
      //   console.log(issues);
      resolve(issues)
    });
  });
}



function insertIssues() {
  fetchIssues('Charrondev', 'slack-issue-bot')
    .then(issues => {
      knex('issues').select('url')
        .then(rows => {
          console.log(rows);
          issues.filter((element) => {
            for (url in rows) {
                console.log(url +" "+ rows.url);
              if (url === element.url) {
                console.log('duplicate');
                return false;
              }
            }
            console.log('no duplicates');
            return true;
          });
          console.log(issues);
          knex('issues').insert(issues);
        });
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = {
  fetchIssues,
  insertIssues
};
