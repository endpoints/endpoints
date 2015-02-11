const config = require('../knexfile');

const fantasyDatabase = require('fantasy-database');
const bPromise = require('bluebird');
const Knex = require('knex')(config);
const Bookshelf = require('bookshelf')(Knex);

const tables = ['series', 'authors', 'books', 'stores', 'books_stores'];

function migrateUntil(stopVersion) {
  return Knex.migrate.rollback(config).spread(function (version, file) {
    if (version > stopVersion) {
      return migrateUntil(stopVersion);
    }
  });
}

module.exports = Bookshelf;

module.exports.empty = function() {
  return bPromise.each(tables, function(table) {
    return Knex.raw('DROP TABLE ' + table);
  });
};

module.exports.reset = function () {
  return migrateUntil(0).then(function () {
    return Knex.migrate.latest(config).then(function () {
      return bPromise.each(tables, function (table) {
        return bPromise.each(fantasyDatabase[table], function (record) {
          return Knex(table).insert(record);
        });
      });
    });
  });
};
