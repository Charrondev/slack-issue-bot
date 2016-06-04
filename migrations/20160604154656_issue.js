exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('issues', table => {
        table.renameColumn('isOpen', 'is_closed')
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('issues', table => {
        table.renameColumn('is_closed', 'isOpen')
    }),
  ]);
};
