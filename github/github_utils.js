var GitHubApi = require('github');
var knex = require('../db');
var moment = require('moment');



var tokens = require('../tokens');
var gitToken = tokens.github;

const per_page = 100;

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

function fetchAllIssues(user, repo) {
  getIssuesNum(user, repo)
    .then(num => {
      pages = Math.ceil(num/per_page);
      page_arr = new Array(pages);
      for (var i = 0; i < page_arr.length; i++) {
          page_arr[i]= i+1;
      }
      console.log(page_arr);
    });
}

function getIssuesNum(user, repo) {
  return new Promise((resolve, reject) => {
    github.repos.get({
      user,
      repo
    }, (err, res) => {
      if (err) reject(err);
      resolve(res.open_issues);
    })
  })

}

function fetchIssues(user, repo) {
  return new Promise((resolve, reject) => {
    github.issues.getForRepo({
      user,
      repo,
      per_page,
      page: 2
    }, (err, res) => {
      if (err) reject(err);
      res = res.filter((element) => { //remove pull request from issues list
        if (element.pull_request == null) {
          console.log('not pull');
          return true;
        }
        console.log('pull');
        return false;
      });
      const issues = res.map(element => ({
        title: element.title,
        author: element.user.login,
        user_url: element.user.html_url,
        image_url: element.user.avatar_url,
        url: element.html_url,
        issue_num: element.number,
        text: element.body,
        created_at: element.created_at,
        updated_at: element.updated_at,
        is_closed: 0
      }));
      console.log(res[0]);
      //   console.log(issues);
      resolve(issues)
    });
  });
}



function insertIssues(user, repo) {
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

function parseURL(url) {
  url_params = url.split('/');
  return obj = {
    user: url_params[url_params.length - 2],
    repo: url_params[url_params.length - 1]
  }
}

function syncFromGitHub(url) {
  var source = parseURL(url);
  insertIssues(source.user, source.repo);
}

function format_timestamp(timestamp) {
  return moment(timestamp).format('X'); // x for ms, X for s
}

module.exports = {
  fetchAllIssues,
  fetchIssues,
  insertIssues,
  parseURL,
  format_timestamp,
  syncFromGitHub,
  getIssuesNum

};
