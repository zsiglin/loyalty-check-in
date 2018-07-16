exports.up = function(knex, Promise) {
    return knex.schema.createTable('checkins', (t) => {
        t.increments('id').unsigned().primary();
        t.integer('userId').references('id').inTable('user').onDelete('cascade');
        t.integer('points').notNull().defaultTo(0);
        t.dateTime('createdAt').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('checkins');
};
