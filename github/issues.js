var GitHubApi = require('github');

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
    getAllIssues: () => {
        var issues = github.issues.getAll({});
        console.log(issues);
    },
    getOneIssue: ()=>{

    }
};
