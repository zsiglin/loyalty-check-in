exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (t) => {
        t.increments('id').unsigned().primary();
        t.string('phoneNumber').notNull().unique();
        t.string('emailAddress').notNull();
        t.string('firstName').notNull();
        t.string('lastName').notNull();
        t.dateTime('createdAt').defaultTo(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('users');
};
