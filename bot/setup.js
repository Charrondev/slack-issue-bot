module.exports = (controller, bot) => {
  // get all the users and add the to the database.
  bot.api.users.list({}, (err, response) => {
    console.log(response);
  });
};
