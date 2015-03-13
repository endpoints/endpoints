const expect = require('chai').expect;

const toOneRelations = require('../../lib/to_one_relations');

const Fixture = require('../../../../test/app/fixture');
const Books = require('../../../../test/app/src/modules/books/model');

describe('toOneRelations', function () {

  var model;

  before(function () {
    return Fixture.reset().then(function () {
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
