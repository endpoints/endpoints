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
      var expected = Object.keys(BooksModel.filters).concat(['id']);
      expect(BooksSource.filters()).to.deep.equal(expected);
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

    it('should find resource on the underlying model by id', function () {
      return BooksSource.byId(1).then(function (book) {
        expect(book.toJSON()).to.deep.equal(fantasyDatabase.books[0]);
      });
    });

  });

  describe('#create', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        BooksSource.create();
      }).to.throw(/No method/);
    });

    it('should create resource using the underlying model', function () {
      return BooksSource.read(null).then(function (allBooks) {
        var totalBooks = allBooks.length;
        BooksSource.create('create', {
          author_id:1,
          title: 'test book',
          date_published: '2015-02-01'
        }).then(function (book) {
          expect(book).to.be.an.instanceof(BooksModel);
          BooksSource.read(null).then(function (allBooksPlusNew) {
            expect(totalBooks + 1).to.equal(allBooksPlusNew.length);
          });
        });
      });
    });

    it('should create with an id specified', function() {
      return BooksSource.read(null).then(function (allBooks) {
        var totalBooks = allBooks.length;
        BooksSource.create('create', {
          id: 9999,
          author_id:1,
          title: 'test book',
          date_published: '2015-02-01'
        }).then(function (book) {
          expect(book).to.be.an.instanceof(BooksModel);
          expect(book.id).to.equal(9999);
          BooksSource.read(null).then(function (allBooksPlusNew) {
            expect(totalBooks + 1).to.equal(allBooksPlusNew.length);
          });
        });
      });
    });

    it('should throw if trying to create with an existing id', function() {
      expect(BooksSource.create('create', {
        id: 1,
        author_id:1,
        title: 'test book',
        date_published: '2015-02-01'
      })).to.be.rejectedWith(/SQLITE_CONSTRAINT: UNIQUE/);
    });

  });

  describe('#read', function () {

    it('should find data using the underlying model', function () {
      return BooksSource.read({}).then(function (books) {
        expect(books.length).to.equal(fantasyDatabase.books.length);
      });
    });

    it('should allow filtering', function () {
      return BooksSource.read({
        filter: { id: 1 }
      }).then(function (books) {
        expect(books.first().toJSON({
          shallow:true
        })).to.deep.equal(fantasyDatabase.books[0]);
      });
    });

    it('should allow finding with related data', function () {
      return BooksSource.read({
        filter: { id: 1 },
        include: ['author']
      }).then(function (books) {
        expect(books.first().toJSON({
          shallow: true
        })).to.deep.equal(fantasyDatabase.books[0]);
        expect(books.first().related('author').toJSON({
          shallow: true
        })).to.deep.equal(fantasyDatabase.authors[0]);
      });
    });

  });

  describe('#update', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        BooksSource.update();
      }).to.throw(/No method/);
    });

    it('should update resource using the underlying model', function () {
      var newTitle = 'altered book';
      return BooksSource.byId(1).then(function (bookOne) {
        BooksSource.update(bookOne, 'update', {
          title: 'altered book'
        }).then(function (data) {
          expect(data).to.be.an.instanceof(BooksModel);
          expect(data.get('title')).to.equal(newTitle);
        });
      });
    });

  });

  describe('#destroy', function () {

    it('should throw if no method is provided', function () {
      expect(function () {
        BooksSource.destroy();
      }).to.throw(/No method/);
    });

    it('should destroy resource using the underlying model', function () {
      return BooksSource.read({}).then(function (allBooks) {
        var totalBooks = allBooks.length;
        BooksSource.destroy(allBooks.first(), 'destroy').then(function (book) {
          BooksSource.read(null, {}).then(function (allBooksMinusOne) {
            expect(totalBooks - 1).to.equal(allBooksMinusOne.length);
          });
        });
      });
    });

  });

});
