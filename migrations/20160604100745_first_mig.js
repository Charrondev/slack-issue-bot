
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('issue', function(table) {
            table.increments('i_id').primary();
            table.string('title');
            table.string('author');
            table.string('url');
            table.string('issue_num');
            table.string('label');
            table.text('text');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        }),
        knex.schema.createTable('follower', function(table) {
            table.increments('id').primary();
            table.string('i_id');
            table.string('u_id');
        }),
        knex.schema.createTable('comment', function(table) {
            table.increments('c_id').primary();
            table.string('i_id');
            table.string('u_id');
            table.text('text');
            table.timestamp('posted_at').defaultTo(knex.fn.now());
        }),
        knex.schema.createTable('repo', function(table) {
            table.string('channel').primary();
            table.string('repo');
        })
    ]);

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('issue'),
        knex.schema.dropTable('comments'),
        knex.schema.dropTable('repo')

    ]);
};