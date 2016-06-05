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
  return new Promise((resolve, reject) => {
    getIssuesNum(user, repo)
      .then(num => {
        var pages = Math.ceil(num / per_page);
        const pageRequests = [];
        console.log(num);
        for (var i = 0; i < pages; i++) {
          pageRequests.push(fetchIssues(user, repo, i + 1));
        }
        Promise.all(pageRequests).then(res => {
            var arr = [];
            for (var i = 0; i < res.length; i++) {
              arr = arr.concat(res[i]);
            }

            console.log(arr);
            resolve(arr);
          })
          .catch(error => {
            // console.log(error);
            reject(error);
          })

      });
  })

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

function fetchIssues(user, repo, page) {
  return new Promise((resolve, reject) => {
    github.issues.getForRepo({
      user,
      repo,
      per_page,
      page
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
      //   console.log(res[0]);
      //   console.log(issues);
      resolve(issues);
    });
  });
}



function insertIssues(user, repo) {
  fetchAllIssues(user, repo)
    .then(issues => {
      return knex('issues').whereNotNull('url').del()
        .then(res => {
          insertion(issues).catch(error =>{
              console.log(error);
          });
        });
    })
    .catch(error => {
      console.log(error);
    });
}

function insertion(issues) {
  return new Promise((resolve, reject) => {
    if (issues.length > 100) {
      var current = issues.slice(0, 100);
      return knex('issues').insert(current)
        .then(res =>{
            if(issues.slice(100).length > 0)
              insertion(issues.slice(100));
        })
        .catch(error => {
          console.log(error);
        });
    } else {
        if(issues.slice(100).length > 0)
            return knex('issues').insert(issues).catch(error =>{
                console.log(error);
            })

    }
  })
}

function parseURL(url) {
  var url_params = url.split('/');
  return {
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
