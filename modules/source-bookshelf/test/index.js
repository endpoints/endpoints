const expect = require('chai').expect;

const BookshelfSource = require('../');
const BooksModel = require('../../../test/fixtures/models/books');
const BooksSource = new BookshelfSource({
  model: BooksModel
});
const fantasyDatabase = require('fantasy-database');
const DB = require('../../../test/fixtures/classes/database');

describe('BookshelfSource', function () {

  beforeEach(function () {
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

  describe('#byId', function () {

    it('should find resource on the underlying model by id', function (done) {
      BooksSource.byId(1, function (err, book) {
        expect(book.toJSON()).to.deep.equal(fantasyDatabase.books[0]);
        done();
      });
    });

  });

  describe('#create', function (done) {

    it('should throw if no method is provided', function () {
      expect(function () {
        BooksSource.create({});
      }).to.throw(/No method/);
    });

    it('should create resource using the underlying model', function (done) {
      BooksSource.read(null, function (findErr, allBooks) {
        var totalBooks = allBooks.length;
        BooksSource.create({
          author_id:1,
          title: 'test book',
          date_published: '2015-02-01'
        }, { method: 'create' }, function (err, book) {
          BooksSource.read(null, function (findNewErr, allBooksPlusNew) {
            expect(totalBooks + 1).to.equal(allBooksPlusNew.length);
            done();
          });
        });
      });

    });

  });

  describe('#read', function (done) {

    it('should find data using the underlying model', function (done) {
      BooksSource.read({}, function (err, books) {
        expect(books.length).to.equal(fantasyDatabase.books.length);
        done();
      });
    });

    it('should allow filtering', function (done) {
      BooksSource.read({
        filters: { id: 1 }
      }, function (err, books) {
        expect(books.first().toJSON()).to.deep.equal(fantasyDatabase.books[0]);
        done();
      });
    });

    it('should allow finding with related data', function (done) {
      BooksSource.read({
        filters: { id: 1 },
        relations: ['author']
      }, function (err, books) {
        expect(books.first().toJSON({
          shallow: true
        })).to.deep.equal(fantasyDatabase.books[0]);
        expect(books.first().related('author').toJSON({
          shallow: true
        })).to.deep.equal(fantasyDatabase.authors[0]);
        done();
      });
    });

  });

  describe('#update', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        BooksSource.update({});
      }).to.throw(/No method/);
    });

    it('should update resource using the underlying model', function (done) {
      var newTitle = 'altered book';
      BooksSource.byId(1, function (findErr, bookOne) {
        BooksSource.update({
          title: 'altered book'
        }, { method: 'update', model: bookOne }, function () {
          BooksSource.byId(1, function (err, book) {
            expect(book.get('title')).to.equal(newTitle);
            done();
          });
        });
      });
    });

  });

  describe('#destroy', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        BooksSource.destroy({});
      }).to.throw(/No method/);
    });

    it('should destroy resource using the underlying model', function (done) {
      BooksSource.read({}, function (findErr, allBooks) {
        var totalBooks = allBooks.length;
        BooksSource.destroy({}, {
          method: 'destroy',
          model: allBooks.first()
        }, function (err, book) {
          BooksSource.read({}, function (findNewErr, allBooksMinusOne) {
            expect(totalBooks - 1).to.equal(allBooksMinusOne.length);
            done();
          });
        });
      });
    });

  });

});
