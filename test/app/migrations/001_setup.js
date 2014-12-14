exports.up = function(knex, Promise) {
  return knex.schema.createTable('account', function(t) {
    t.increments('id');
    t.text('name').notNullable();
    t.text('email').notNullable();
    t.boolean('active').notNullable().defaultsTo(false);
  }).createTable('group', function(t) {
    t.increments('id');
    t.text('name').notNullable().unique();
  }).createTable('account_group', function(t) {
    t.integer('account_id').references('id').inTable('account').notNullable();
    t.integer('group_id').references('id').inTable('group').notNullable();
    t.primary('account_id', 'group_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('acount_group')
  .dropTableIfExists('account')
  .dropTableIfExists('group');
};
