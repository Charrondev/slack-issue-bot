const github = require('./issues');

var issues = github.getAllIssues('Charrondev','slack-issue-bot');
console.log(issues[0]);
