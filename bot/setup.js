const knex = require('../db');

module.exports = (controller, bot) => {
  // get all the users and add the to the database.
  bot.api.users.list({}, (err, response) => {
    knex('users')
      .insert([sanitizeUsers])
      .catch(error => {
        // handle error
      })
  });
};

function sanitizeUsers(users) {
  return users
          .filter(element => !element.is_bot)
          .map(element => ({
            id: element.id,
            username: element.name,
            real_name: element.real_name
          }));
}
