const expect = require('chai').expect;

const BookshelfSource = require('../');
const BooksModel = require('../../../test/fixtures/models/books');
const BooksSource = new BookshelfSource({
  model: BooksModel
});
const DB = require('../../../test/fixtures/classes/database');

describe('BookshelfSource', function () {
  before(function () {
    return DB.reset();
  });

  describe('constructor', function () {
    it('should throw if a model isn\'t provided', function () {
      expect(function () {
        new BookshelfSource();
      }).throws('No bookshelf model specified.');
    });
  });

  describe('#filters', function () {
    it('should return filters for this source', function () {
      expect(BooksSource.filters()).to.deep.equal(BooksModel.filters);
    });
  });

  describe('#relations', function () {
    it('should return relations for this source', function () {
      expect(BooksSource.relations()).to.deep.equal(BooksModel.relations);
    });
  });

  describe('#typeName', function () {
    it('should return the typeName for this source', function () {
      expect(BooksSource.typeName()).to.deep.equal(BooksModel.typeName);
    });
  });

  describe('#find', function () {

  });

  describe('#byId', function () {

  });

  describe('#create', function () {

  });

  describe('#read', function () {

  });

  describe('#update', function () {

  });

  describe('#destroy', function () {

  });

});
