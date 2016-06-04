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

module.exports = {
    getAllIssues: (user,repo) => {
      return new Promise((resolve, reject) => {
        github.issues.getForRepo({user,repo}, (err, res) =>{
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
            console.log(issues);
            resolve(issues);
        });
      });
    }
};
