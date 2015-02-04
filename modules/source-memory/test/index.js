const _ = require('lodash');
const expect = require('chai').expect;
const database = require('fantasy-database');

const MemorySource = require('../');

const BooksModel = require('./fixtures/models/books');
const BooksSource = new MemorySource({
  model: BooksModel
});

const bookOne = database.books[0];
const tolkienBooks = _.filter(database.books, {author_id:1});

describe('MemorySource', function () {

  describe('lib', function () {
    require('./lib/parse_options');
  });

  describe('#filters', function () {
    it('should return the filters on the source', function () {
      expect(BooksSource.filters()).to.equal(BooksModel.filters);
    });
  });

  describe('#relations', function () {
    it('should return the relations on the underlying model', function () {
      expect(BooksSource.relations()).to.deep.equal(Object.keys(BooksModel.relations));
    });
  });

  describe('#typeName', function () {
    it('should return the typeName on the underlying model', function () {
      expect(BooksSource.typeName()).to.equal(BooksModel.typeName);
    });
  });

  describe('#filter', function () {
    it('should return a lodash chain whose value outputs models that match the filters', function () {
      expect(BooksSource.filter({id: 1}).value()).to.deep.equal([bookOne]);
      expect(BooksSource.filter({title: 'The Fellowship of the Ring'}).value()).to.deep.equal([bookOne]);
      expect(BooksSource.filter({author_id: 1}).value()).to.deep.equal(tolkienBooks);
      expect(BooksSource.filter({author_id: 5}).value()).to.deep.equal([]);
      expect(BooksSource.filter({
        id: 1,
        author_id: 1
      }).value()).to.deep.equal([bookOne]);
      expect(BooksSource.filter({
        id: 1,
        title: 'n/a'
      }).value()).to.deep.equal([]);
    });
  });

  describe('#byId', function () {
    it('should call back with the model that matches the id', function () {
      BooksSource.byId(1, function (err, result) {
        expect(result).to.deep.equal(bookOne);
      });
    });
  });

  describe('#create', function () {
    it('should create a new model and call back with it', function () {
      var newModel = {
        title: 'test book'
      };
      BooksSource.create('create', newModel, function (err, model) {
        expect(model).to.deep.equal(newModel);
      });
    });
  });

  describe('#read', function () {
  });

  describe('#update', function () {
  });

  describe('#destroy', function () {
  });

});
