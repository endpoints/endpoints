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

  it('should return an empty object if invalid relations are provided', function () {
    expect(toOneRelations(model)).to.deep.equal({});
  });

  it('should return an object describing the to-one relations on a model', function () {
    expect(toOneRelations(model, ['author'])).to.deep.equal({
      author: 'author_id'
    });
  });

  it('should ignore nested relations', function () {
    expect(toOneRelations(model, ['author', 'author.books'])).to.deep.equal({
      author: 'author_id'
    });
  });

  it('should throw on invalid relations', function () {
    expect(function () {
      toOneRelations(model, ['invalid']);
    }).to.throw;
  });

});
