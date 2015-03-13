const fantasyDatabase = require('fantasy-database');
const tables = Object.keys(fantasyDatabase);

const bPromise = require('bluebird');

const config = require('./knexfile');
const DB = require('./src/classes/database');

exports.dropTables = function () {
  return migrateUntil(0);
};

exports.reset = function () {
  return migrateUntil(0).then(function () {
    return DB.Knex.migrate.latest(config).then(function () {
      return bPromise.each(tables, function (table) {
        return bPromise.each(fantasyDatabase[table], function (record) {
          return DB.Knex(table).insert(record);
        });
      });
    });
  });
};

function migrateUntil(stopVersion) {
  return DB.Knex.migrate.rollback(config).spread(function (version, file) {
    if (version > stopVersion) {
      return migrateUntil(stopVersion);
    }
  });
}
