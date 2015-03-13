# Step 1: Hello, Knex!

Knex is primarily a SQL query builder for JavaScript. We'll be
leveraging it to run migrations and seed our database.

### sqlite3 Dependency

We'll be using a sqlite3 database in this tutorial, so we need 
to add it as a dependency:

`npm install sqlite3 3.0.5 --save`

### Setting up our database and Knex

First, let's add Knex as a dependency:

`npm install knex 0.7.6 --save`

Next, in the root of our application directory, we'll create a 
`knexfile.js` with the following code:


    //knexfile.js
    module.exports = {
      client: 'sqlite3',
      debug: true,
      connection: {
        filename: 'dev.db'
      }
    };


This code provides configuration information to knex; stating
that we'll be using a sqlite3 database that will exist in the
root of our application directory, and be named `dev.db`.

#### Writing Migrations and Seeds

The next step in the process is to write migration to create
tables in our database. We'll put these in a `migrations`
directory in the root of our application directory.

Lucky for you, we'll be using some pre-existing dummy data, so
we've written the migrations for you already. Create a file
`migrations/fantasy.js` with the following contents:


    //migrations.fantasy.js
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
          t.date('date_of_death')
        }).
        createTable('books', function (t) {
          t.increments('id');
          t.integer('author_id').notNullable().references('id').inTable('authors');
          t.integer('series_id').references('id').inTable('series');
          t.date('date_published').notNullable();
          t.text('title');
        }).
        createTable('chapters', function (t) {
          t.increments('id');
          t.integer('book_id').notNullable().references('id').inTable('book');
          t.text('title').notNullable();
          t.integer('ordering').notNullable();
        }).
        createTable('stores', function (t) {
          t.increments('id');
          t.text('name').notNullable();
        }).
        createTable('books_stores', function (t) {
          t.integer('book_id').notNullable().references('id').inTable('books');
          t.integer('store_id').notNullable().references('id').inTable('stores');
        });
      };

    exports.down = function (knex) {
      return knex.schema.
        dropTable('chapters').
        dropTable('books').
        dropTable('authors').
        dropTable('series');
    };


As you can see, we'll be working with a database with 4 tables: chapters,
books, authors, and series. We can test that this works by using the Knex
CLI, typing `knex migrate:latest` in our console. You should see that all
the tables are created, confirmed by seeing the following output:


    Batch 1 run: 1 migrations 
    /home/ag_dubs/Projects/endpoints/tutorial/migrations/fantasy.js


Now we need to seed the database. We've also written this code for you! 

The code we'll write reads in data from a mock database, 
[fantasy-database](https://github.com/endpoints/fantasy-database) and 
seeds our database with it. To use it in our application, we'll add it
as a dependency to our application:

`npm install fantasy-database --save`

Next, create a file `seeds/fantasy.js` in the root of your application
directory:


    // seeds/fantasy.js
    const fantasyDatabase = require('fantasy-database');

    exports.seed = function (knex, Promise) {
      var tables = [
        'authors',
        'books',
        'chapters',
        'series',
        'stores',
        'books_stores'
      ];
      return Promise.reduce(tables, function (_, table) {
        var records = fantasyDatabase[table];
        return Promise.all(records.map(function (record) {
          return knex(table).insert(record);
        }));
      }, null);
    };


This code reads in data from a mock database,
[fantasy-database](https://github.com/endpoints/fantasy-database) and
inserts the records into our database. 

We can test that this code works by again utilizing the Knex CLI comamnd
`knex seed:run`. Before we run this, we'll need to update our `knexfile.js`
with information about where our seeds are:


    module.exports = {
      development: {
        client: 'sqlite3',
        debug: true,
        connection: {
          filename: 'dev.db'
        },
        seeds: {
          directory: './seeds'
        }
      }
    };


You'll know it worked when you see the SQL debug output, followed by:


    Ran 1 seed files 
    /home/ag_dubs/Projects/endpoints/tutorial/seeds/fantasy.js 


Now that we have our database set up and seeded, we're ready to start
building our modules.

[Next](/tutorial/step-2)
