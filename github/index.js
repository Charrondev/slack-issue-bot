const github = require('./issues');
const knex = require('../db');

github.getAllIssues('Charrondev','slack-issue-bot')
  .then(issues => {
    return knex('issue')
      .insert(issues);
  }).catch(error => {
    console.log(error);
  });
