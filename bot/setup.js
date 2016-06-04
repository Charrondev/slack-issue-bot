const knex = require('../db');

module.exports = (controller, bot) => {
  // get all the users and add the to the database.
  bot.api.users.list({}, (err, response) => {
    knex('users')
      .delete()
      .then(() => {
        return knex('users')
          .insert(sanitizeUsers(response.members));
      })
      .catch(error => {
        // handle error
        console.log(error);
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
