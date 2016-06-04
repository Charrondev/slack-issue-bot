const github = require('./github_utils');
const knex = require('../db');

console.log(github.parseURL('https://github.com/mikedeboer/node-github'));
