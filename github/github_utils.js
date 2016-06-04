var GitHubApi = require('github');
var knex = require('../db');

var tokens = require('../tokens');
var gitToken = tokens.github;

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
github.authenticate({
  type: 'oauth',
  token: gitToken
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
        author: element.user.login, //star to denote git authors
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



function insertIssues(user,repo) {
  fetchIssues(user, repo)
    .then(issues => {
      knex('issues').select('url')
        .then(rows => {
          issues = issues.filter((element) => {
            for (var i = 0; i < rows.length; i++) {
              if (rows[i].url === element.url) {
                return false;
              }
            }
            return true;
          });
          if (issues.length > 0)
            knex('issues').insert(issues).catch(error => {
              console.log(error);
            });
        });
    })
    .catch(error => {
      console.log(error);
    });
}

function parseURL(url){
    url_params = url.split('/');
    return obj = {
        user: url_params[url_params.length-2],
        repo: url_params[url_params.length-1]
    }
}

function syncFromGitHub(user,repo){

}

module.exports = {
  fetchIssues,
  insertIssues,
  parseURL
};
