const path = require('path');

const Knex = require('knex')({
  client: 'sqlite3',
  debug: true,
  connection: {
    filename: path.join(__dirname, '..', '..', 'fantasy.db')
  }
});
const Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;
