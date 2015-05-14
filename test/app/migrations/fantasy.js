exports.up = function (knex) {
  return knex.schema.
    createTable('series', function (t) {
      t.increments('id');
      t.text('title').notNullable().unique();
      t.integer('photo_id').notNullable().references('id').inTable('photos');
    })
    .createTable('photos', function (t) {
      t.increments('id');
      t.integer('imageable_id').notNullable();
      t.text('imageable_type').notNullable();
      t.text('title').notNullable();
      t.text('uri').notNullable();
    })
    .createTable('authors', function (t) {
      t.increments('id');
      t.text('name').notNullable();
      t.date('date_of_birth').notNullable();
      t.date('date_of_death');
    })
    .createTable('books', function (t) {
      t.increments('id');
      t.integer('author_id').notNullable().references('id').inTable('authors');
      t.integer('series_id').references('id').inTable('series');
      t.date('date_published').notNullable();
      t.text('title');
      t.timestamps();
    })
    .createTable('chapters', function (t) {
      t.increments('id');
      t.integer('book_id').notNullable().references('id').inTable('books');
      t.text('title').notNullable();
      t.integer('ordering').notNullable();
    })
    .createTable('stores', function (t) {
      t.increments('id');
      t.text('name').notNullable();
    })
    .createTable('books_stores', function (t) {
      t.integer('book_id').notNullable().references('id').inTable('books');
      t.integer('store_id').notNullable().references('id').inTable('stores');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('books_stores')
    .dropTable('stores')
    .dropTable('chapters')
    .dropTable('books')
    .dropTable('authors')
    .dropTable('photos')
    .dropTable('series');
};
