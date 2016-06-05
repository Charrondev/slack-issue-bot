exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('issues', table => {
      table.dropColumn('issue_num')
    }).then(() => {
      return knex.schema.table('issues', table => {
        table.integer('issue_num')
      })
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('issues', table => {
      table.dropColumn('issue_num')
    }).then(() => {
      return knex.schema.table('issues', table => {
        table.string('issue_num')
      })
    })
  ]);
};
