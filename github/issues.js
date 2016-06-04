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
        github.issues.getForRepo({user,repo}, (err, res) =>{
            console.log(res);
            
        });

    }
};
