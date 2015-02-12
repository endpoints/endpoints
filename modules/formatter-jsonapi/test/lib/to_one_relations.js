const expect = require('chai').expect;

const toOneRelations = require('../../lib/to_one_relations');

const DB = require('../../../../test/fixtures/classes/database');
const Books = require('../../../../test/fixtures/models/books');

describe('toOneRelations', function () {

  var model;

  before(function () {
    return DB.reset().then(function () {
      return new Books({id:1}).fetch().then(function (result) {
        model = result;
      });
    });
  });

  it('should return an array of to-one relations on a model', function () {
    expect(toOneRelations(model, model.constructor.relations)).to.deep.equal({'author': 'author_id', 'series': 'series_id'});
  });
/*
  it('should ignore nested relations', function () {
    var relations = Books.relations.slice();
    relations.push('authors.books');
    expect(linkWithoutInclude(model, relations)).to.deep.equal(bookLinks);
  });
*/
  it('should throw on invalid relations', function () {
    expect(function () {
      toOneRelations(model, ['invalid']);
    }).to.throw;
  });

});
