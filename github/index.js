const gitUtil = require('./github_utils');
const knex = require('../db');

var sample_time = '2016-06-04T20:38:01Z';

gitUtil.syncFromGitHub('https://github.com/howdyai/botkit');
