exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('issue', table => {
      table.increments('id').primary();
      table.string('title');
      table.string('author');
      table.string('url');
      table.string('issue_num');
      table.string('label');
      table.text('text');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    }),
    knex.schema.createTable('follower', table => {
      table.increments('id').primary();
      table.string('issue_id');
      table.string('user_id');
    }),
    knex.schema.createTable('comment', table => {
      table.increments('id').primary();
      table.string('issue_id');
      table.string('user_id');
      table.text('text');
      table.timestamp('posted_at');
    }),
    knex.schema.createTable('repo', table => {
      table.string('channel').primary();
      table.string('repo');
    }),
    knex.schema.createTable('users', table => {
      table.string('id').unique().primary();
      table.string('username');
      table.string('real_name');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('issue'),
    knex.schema.dropTable('comments'),
    knex.schema.dropTable('repo'),
    knex.schema.dropTable('users')
  ]);
};
