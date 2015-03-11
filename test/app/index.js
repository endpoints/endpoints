const port = process.env.PORT || '8080';
const host = process.env.HOST || '0.0.0.0';
const express = require('express');
const app = express();

const bPromise = require('bluebird');
const fantasyDatabase = require('fantasy-database');
const tables = Object.keys(fantasyDatabase);
const DB = require('./src/classes/database');
const config = require('./knexfile');

app.use(require('./src'));

app.listen(port, host);

console.log('Server running on, %s:%d', host, port);

module.exports = app;
module.exports.baseUrl = 'http://' + host + ':' + port + '/v1';

module.exports.empty = function () {
  return DB.Knex.migrate.rollback(config);
};

module.exports.reset = function () {
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
