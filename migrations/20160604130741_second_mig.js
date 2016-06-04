
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('issue', table => {
            table.dropColumn('label');
        }),
        knex.schema.table('repo', table => {
            table.string('user');
        }),
        knex.schema.createTable('label', table => {
            table.increments('id').primary();
            table.string('label');
            table.string('issue_id');
        })
    ])

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('issue', table => {
            table.string('label');
        }),
        knex.schema.table('repo', table => {
            table.dropColumn('user');
        }),
        knex.schema.dropTable('label')
    ])
};
