const expect = require('chai').expect;

const DB = require('../../../../test/fixtures/classes/database');
const BooksModel = require('../../../../test/fixtures/models/books');

const validateRelation = require('../../lib/validate_relation');

describe('validateRelation', () => {
  var model;
  before(() => {
    return DB.reset().then(() => {
      BooksModel.forge({id:1}).fetch({
        withRelated: ['author', 'chapters']
      }).then(function (book) {
        model = book;
      });
    });
  });

  it('should throw if requested relation doesn\'t exist for model', () => {
    return expect(validateRelation(model, 'nope')).
      to.be.rejectedWith(/Unable to find/);
  });

  it('should fullfill when setting a toOne relationship to null', () => {
    return expect(validateRelation(model, 'author', null)).to.be.fulfilled;
  });

  it('should fullfill when setting a toOne relationship to a valid relation', () => {
    return expect(validateRelation(model, 'author', 2)).to.be.fulfilled;
  });

  it('should throw when setting a toOne relationship to a invalid relation', () => {
    return expect(validateRelation(model, 'author', 100)).to.be.rejectedWith(/Unable to find/);
  });

  it('should ??? when setting a toMany relation to null');

  it('should fullfill when setting a toMany relationship to []', () => {
    return expect(validateRelation(model, 'chapters', [])).to.be.fulfilled;
  });

  it('should fullfill when setting a toMany relationship to a valid relation', () => {
    return expect(validateRelation(model, 'chapters', [1, 2])).to.be.fulfilled;
  });

  it('should throw when setting a toMany relationship if any relations are missing', () => {
    return expect(validateRelation(model, 'chapters', [10000])).to.be.rejectedWith(/Unable to find/);
  });

});
