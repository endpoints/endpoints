exports.up = function (knex) {
  return knex.schema.
    createTable('series', function (t) {
      t.increments('id');
      t.text('title').notNullable().unique();
    }).
    createTable('authors', function (t) {
      t.increments('id');
      t.text('name').notNullable();
      t.date('date_of_birth').notNullable();
      t.date('date_of_death');
    }).
    createTable('books', function (t) {
      t.increments('id');
      t.integer('author_id').notNullable().references('id').inTable('authors');
      t.integer('series_id').notNullable().references('id').inTable('series');
      t.date('date_published').notNullable();
      t.text('title');
    }).
    createTable('chapters', function (t) {
      t.increments('id');
      t.integer('book_id').notNullable().references('id').inTable('book');
      t.text('title').notNullable();
      t.integer('ordering').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.
    dropTable('chapters').
    dropTable('books').
    dropTable('authors').
    dropTable('series');
};
