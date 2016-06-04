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
    getAllIssues: (user,repo) => {
        github.issues.getForRepo({user,repo}, (err, res) =>{
            console.log(res);
        });

    },
    getOneIssue: ()=>{
        github.issues.get({
            user: 'Charrondev',
            repo: 'slack-issue-bot',
            number: 1}, (err, res) => {
                console.log(res);
            });


    },
    getFollowingForUser: () =>{
        github.users.getFollowingForUser({
        // optional:
        // headers: {
        //     "cookie": "blahblah"
        // },
        user: "fredericDaigle"
    }, function(err, res) {
        console.log(JSON.stringify(res));
    });
    }


};
