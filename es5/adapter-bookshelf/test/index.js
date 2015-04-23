'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _chai = require('chai');

var _chai2 = _interopRequireWildcard(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireWildcard(_chaiAsPromised);

var _fantasyDatabase = require('fantasy-database');

var _fantasyDatabase2 = _interopRequireWildcard(_fantasyDatabase);

var _BookshelfAdapter = require('../');

var _BookshelfAdapter2 = _interopRequireWildcard(_BookshelfAdapter);

var _BooksModel = require('../../../test/app/src/modules/books/model');

var _BooksModel2 = _interopRequireWildcard(_BooksModel);

var _Fixture = require('../../../test/app/fixture');

var _Fixture2 = _interopRequireWildcard(_Fixture);

_chai2['default'].use(_chaiAsPromised2['default']);

var Books = new _BookshelfAdapter2['default']({
  model: _BooksModel2['default']
});

describe('BookshelfAdapter', function () {

  describe('lib', function () {
    require('./lib/sanitize_request_data');
  });

  beforeEach(function () {
    return _Fixture2['default'].reset();
  });

  describe('constructor', function () {

    it('should throw if a model isn\'t provided', function () {
      _chai.expect(function () {
        new _BookshelfAdapter2['default']();
      }).throws('No bookshelf model specified.');
    });
  });

  describe('#filters', function () {

    it('should return filters for this source', function () {
      var expected = Object.keys(_BooksModel2['default'].filters).concat(['id']);
      _chai.expect(Books.filters()).to.deep.equal(expected);
    });
  });

  describe('#relations', function () {

    it('should return relations for this source', function () {
      _chai.expect(Books.relations()).to.deep.equal(_BooksModel2['default'].relations);
    });
  });

  describe('#typeName', function () {

    it('should return the typeName for this source', function () {
      _chai.expect(Books.typeName()).to.deep.equal(_BooksModel2['default'].typeName);
    });
  });

  describe('#byId', function () {

    it('should find resource on the underlying model by id', function () {
      return Books.byId(1).then(function (book) {
        book = book.toJSON();
        delete book.created_at;
        delete book.updated_at;
        _chai.expect(book).to.deep.equal(_fantasyDatabase2['default'].books[0]);
      });
    });
  });

  describe('#create', function () {

    it('should throw if no method is provided', function () {
      _chai.expect(function () {
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
          _chai.expect(book).to.be.an['instanceof'](_BooksModel2['default']);
          return Books.read(null).then(function (allBooksPlusNew) {
            _chai.expect(totalBooks + 1).to.equal(allBooksPlusNew.length);
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
          _chai.expect(book).to.be.an['instanceof'](_BooksModel2['default']);
          _chai.expect(book.id).to.equal(9999);
          return Books.read(null).then(function (allBooksPlusNew) {
            _chai.expect(totalBooks + 1).to.equal(allBooksPlusNew.length);
          });
        });
      });
    });

    it('should throw if trying to create with an existing id', function () {
      return _chai.expect(Books.create('create', {
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
        _chai.expect(books.length).to.equal(_fantasyDatabase2['default'].books.length);
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
        _chai.expect(firstBook).to.deep.equal(_fantasyDatabase2['default'].books[0]);
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
        _chai.expect(firstBook).to.deep.equal(_fantasyDatabase2['default'].books[0]);
        _chai.expect(books.first().related('author').toJSON({
          shallow: true
        })).to.deep.equal(_fantasyDatabase2['default'].authors[0]);
      });
    });
  });

  describe('#update', function () {

    it('should throw if no method is provided', function () {
      _chai.expect(function () {
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
          _chai.expect(data).to.be.an('object');
          _chai.expect(data.get('title')).to.equal(newTitle);
        });
      });
    });
  });

  describe('#destroy', function () {

    it('should throw if no method is provided', function () {
      _chai.expect(function () {
        Books.destroy();
      }).to['throw'](/No method/);
    });

    it('should destroy resource using the underlying model', function () {
      return Books.read({}).then(function (allBooks) {
        var totalBooks = allBooks.length;
        Books.destroy(allBooks.first(), 'destroy').then(function (book) {
          return Books.read(null, {}).then(function (allBooksMinusOne) {
            _chai.expect(totalBooks - 1).to.equal(allBooksMinusOne.length);
          });
        });
      });
    });
  });
});