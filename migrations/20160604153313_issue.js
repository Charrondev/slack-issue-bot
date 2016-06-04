exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('issue', table => {
        table.boolean('isOpen')
    }),
    knex.schema.renameTable('issue', 'issues')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.renameTable('issues', 'issue'),
    knex.schema.table('issue', table => {
        table.dropColumn('isOpen')
    })
  ]);
};
