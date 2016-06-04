exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('users', table => {
        table.string('image_url');
        table.string('user_url');
    }),
    knex.schema.table('issues', table => {
      table.string('image_url'),
      table.string('user_url')
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('users', table => {
        table.dropColumn('image_url');
        table.dropColumn('user_url');
    }),
    knex.schema.table('issues', table => {
      table.dropColumn('image_url'),
      table.dropColumn('user_url')
    })
  ]);
};
