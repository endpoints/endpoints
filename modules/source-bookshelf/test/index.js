const config = require('./fixture/knexfile');
const DB = require('./fixture/classes/database').knex;
const fantasyDatabase = require('fantasy-database');
const bPromise = require('bluebird');
const expect = require('chai').expect;

function resetDB () {
  return DB.migrateTo(0).then(function () {
    return DB.migrate.latest(config).then(function () {
      var tables = Object.keys(fantasyDatabase);
      return bPromise.each(tables, function (table) {
        return bPromise.each(fantasyDatabase[table], function (record) {
          return DB(table).insert(record);
        });
      });
    });
  });
}

const Source = require('../');
const AuthorsModel = require('./fixture/models/authors');

const Authors = new Source({
  model: AuthorsModel
});

describe('Source', function () {
  before(function () {
    return resetDB();
  });

  describe('constructor', function () {
    it('should throw if a model isn\'t provided', function () {
      expect(function () {
        new Source();
      }).throws('No bookshelf model specified.');
    });
  });

  describe('#filters', function () {
    it('should expose filters on the underlying model', function () {
      expect(Authors.filters()).to.deep.equal(AuthorsModel.filters);
    });
  });

  describe('#relations', function () {
    it('should expose relations on the underlying model', function () {
      expect(Authors.relations()).to.deep.equal(AuthorsModel.relations);
    });
  });

  describe('#filter', function () {

  });

  require('./lib/formatters/json_api');

});
