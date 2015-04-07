'use strict';

var chai = require('chai');
var expect = require('chai').expect;
chai.use(require('chai-as-promised'));

var fantasyDatabase = require('fantasy-database');

var BookshelfAdapter = require('../');
var BooksModel = require('../../../test/app/src/modules/books/model');

var Fixture = require('../../../test/app/fixture');

var Books = new BookshelfAdapter({
  model: BooksModel
});

describe('BookshelfAdapter', function () {

  describe('lib', function () {
    require('./lib/sanitize_request_data');
  });

  beforeEach(function () {
    return Fixture.reset();
  });

  describe('constructor', function () {

    it('should throw if a model isn\'t provided', function () {
      expect(function () {
        new BookshelfAdapter();
      }).throws('No bookshelf model specified.');
    });
  });

  describe('#filters', function () {

    it('should return filters for this source', function () {
      var expected = Object.keys(BooksModel.filters).concat(['id']);
      expect(Books.filters()).to.deep.equal(expected);
    });
  });

  describe('#relations', function () {

    it('should return relations for this source', function () {
      expect(Books.relations()).to.deep.equal(BooksModel.relations);
    });
  });

  describe('#typeName', function () {

    it('should return the typeName for this source', function () {
      expect(Books.typeName()).to.deep.equal(BooksModel.typeName);
    });
  });

  describe('#byId', function () {

    it('should find resource on the underlying model by id', function () {
      return Books.byId(1).then(function (book) {
        book = book.toJSON();
        delete book.created_at;
        delete book.updated_at;
        expect(book).to.deep.equal(fantasyDatabase.books[0]);
      });
    });
  });

  describe('#create', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        Books.create();
      }).to['throw'](/No method/);
    });

    it('should create resource using the underlying model', function () {
      return Books.read(null).then(function (allBooks) {
        var totalBooks = allBooks.length;
        return Books.create('create', {
          author_id: 1,
          title: 'test book',
          date_published: '2015-02-01'
        }).then(function (book) {
          expect(book).to.be.an['instanceof'](BooksModel);
          return Books.read(null).then(function (allBooksPlusNew) {
            expect(totalBooks + 1).to.equal(allBooksPlusNew.length);
          });
        });
      });
    });

    it('should create with an id specified', function () {
      return Books.read(null).then(function (allBooks) {
        var totalBooks = allBooks.length;
        return Books.create('create', {
          id: 9999,
          author_id: 1,
          title: 'test book',
          date_published: '2015-02-01'
        }).then(function (book) {
          expect(book).to.be.an['instanceof'](BooksModel);
          expect(book.id).to.equal(9999);
          return Books.read(null).then(function (allBooksPlusNew) {
            expect(totalBooks + 1).to.equal(allBooksPlusNew.length);
          });
        });
      });
    });

    it('should throw if trying to create with an existing id', function () {
      return expect(Books.create('create', {
        id: 1,
        author_id: 1,
        title: 'test book',
        date_published: '2015-02-01'
      })).to.be.rejectedWith(/SQLITE_CONSTRAINT: UNIQUE/);
    });
  });

  describe('#read', function (done) {
    it('should find data using the underlying model', function (done) {
      return Books.read({}).then(function (books) {
        expect(books.length).to.equal(fantasyDatabase.books.length);
        done();
      });
    });

    it('should allow filtering', function () {
      return Books.read({
        filter: { id: 1 }
      }).then(function (books) {
        var firstBook = books.first().toJSON();
        delete firstBook.created_at;
        delete firstBook.updated_at;
        expect(firstBook).to.deep.equal(fantasyDatabase.books[0]);
      });
    });

    it('should allow finding with related data', function () {
      return Books.read({
        filter: { id: 1 },
        include: ['author']
      }).then(function (books) {
        var firstBook = books.first().toJSON({ shallow: true });
        delete firstBook.created_at;
        delete firstBook.updated_at;
        expect(firstBook).to.deep.equal(fantasyDatabase.books[0]);
        expect(books.first().related('author').toJSON({
          shallow: true
        })).to.deep.equal(fantasyDatabase.authors[0]);
      });
    });
  });

  describe('#update', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        Books.update();
      }).to['throw'](/No method/);
    });

    // check the base method for update
    // why are we returning null if it is different?
    it.skip('should update resource using the underlying model', function () {
      var newTitle = 'altered book';
      return Books.byId(1).then(function (bookOne) {
        return Books.update(bookOne, 'update', {
          title: 'altered book'
        }).then(function (data) {
          expect(data).to.be.an('object');
          expect(data.get('title')).to.equal(newTitle);
        });
      });
    });
  });

  describe('#destroy', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        Books.destroy();
      }).to['throw'](/No method/);
    });

    it('should destroy resource using the underlying model', function () {
      return Books.read({}).then(function (allBooks) {
        var totalBooks = allBooks.length;
        Books.destroy(allBooks.first(), 'destroy').then(function (book) {
          return Books.read(null, {}).then(function (allBooksMinusOne) {
            expect(totalBooks - 1).to.equal(allBooksMinusOne.length);
          });
        });
      });
    });
  });
});