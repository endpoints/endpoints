const config = require('../knexfile');

const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);

knex.migrateTo = function migrateUntil(stopVersion) {
  return knex.migrate.rollback(config).spread(function (version, file) {
    if (version > stopVersion) {
      return migrateUntil(stopVersion);
    }
  });
};

module.exports = bookshelf;
