'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expect = require('chai');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _bookshelf = require('bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

var _fantasyDatabase = require('fantasy-database');

var _fantasyDatabase2 = _interopRequireDefault(_fantasyDatabase);

var _BookshelfStore = require('../');

var _BookshelfStore2 = _interopRequireDefault(_BookshelfStore);

var Bookshelf = _bookshelf2['default'](_knex2['default']({
  client: 'sqlite3',
  debug: false,
  connection: {
    filename: _path2['default'].join(_path2['default'].dirname(require.resolve('fantasy-database')), 'fantasy.db')
  }
}));

var Author = Bookshelf.Model.extend({
  tableName: 'authors',
  books: function books() {
    return this.hasMany(Book);
  }
}, {
  relations: ['books', 'books.chapters', 'books.stores']
});

var Book = Bookshelf.Model.extend({
  tableName: 'books',
  author: function author() {
    return this.belongsTo(Author);
  },
  chapters: function chapters() {
    return this.hasMany(Chapter);
  },
  stores: function stores() {
    return this.belongsToMany(Store);
  }
}, {
  relations: ['author', 'chapters', 'stores']
});

var Chapter = Bookshelf.Model.extend({
  tableName: 'chapters',
  book: function book() {
    return this.belongsTo(Book);
  } }, {
  relations: ['book']
});

var Store = Bookshelf.Model.extend({
  tableName: 'stores',
  books: function books() {
    return this.belongsToMany(Book);
  }
}, {
  typeName: 'STORES',
  relations: ['books', 'books.author']
});

describe('JsonApiBookshelf', function () {

  describe('::allRelations', function () {

    it('should be able to find the valid relations from a model class', function () {
      _expect.expect(_BookshelfStore2['default'].allRelations(Book)).to.equal(Book.relations);
    });

    it('should be able to find the valid relations from a model instance', function () {
      _expect.expect(_BookshelfStore2['default'].allRelations(new Book())).to.equal(Book.relations);
    });
  });

  describe('::id', function () {

    it('should return the id attribute of a model', function () {
      var id = 1100;
      _expect.expect(_BookshelfStore2['default'].id(new Book({ id: id }))).to.equal(id);
    });
  });

  describe('::isMany', function () {

    it('should be able to differentiate between a bookshelf collection and model', function () {
      _expect.expect(_BookshelfStore2['default'].isMany(new Book())).to.be['false'];
      _expect.expect(_BookshelfStore2['default'].isMany(Book.collection())).to.be['true'];
    });
  });

  describe('::modelsFromCollection', function () {

    it('should be able to return just the models from a collection', function () {
      var book = new Book({ id: 1 });
      var Books = Book.collection().add(book);
      _expect.expect(_BookshelfStore2['default'].modelsFromCollection(Books)).to.deep.equal([book]);
    });
  });

  describe('::related', function () {

    it('should return a single model related to another model', function () {
      return Book.forge({ id: 1 }).fetch({ withRelated: ['author'] }).then(function (book) {
        return Author.forge({ id: book.get('author_id') }).fetch().then(function (author) {
          _expect.expect(_BookshelfStore2['default'].related(book, 'author').toJSON()).to.deep.equal(author.toJSON());
        });
      });
    });

    it('should return a collection of models related to a single model', function () {
      return Author.forge({ id: 1 }).fetch({ withRelated: ['books'] }).then(function (author) {
        return Book.collection().query(function (qb) {
          return qb.where({ author_id: 1 });
        }).fetch().then(function (books) {
          _expect.expect(_BookshelfStore2['default'].related(author, 'books').toJSON()).to.deep.equal(books.toJSON());
        });
      });
    });

    it('should return a collection of models related to a collection of models', function () {
      return Book.collection().fetch({ withRelated: ['author'] }).then(function (books) {
        return Author.collection().fetch().then(function (authors) {
          _expect.expect(_BookshelfStore2['default'].related(books, 'author').toJSON()).to.deep.equal(authors.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a single model', function () {
      return Author.forge({ id: 1 }).fetch({ withRelated: ['books.chapters'] }).then(function (author) {
        return Book.collection().query(function (qb) {
          return qb.where({ author_id: 1 });
        }).fetch({ withRelated: ['chapters'] }).then(function (books) {
          var relatedChapters = books.reduce(function (result, book) {
            return result.add(book.related('chapters').models);
          }, Chapter.collection());
          _expect.expect(_BookshelfStore2['default'].related(author, 'books.chapters').toJSON()).to.deep.equal(relatedChapters.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a collection of models', function () {
      return Author.collection().fetch({ withRelated: ['books.chapters'] }).then(function (authors) {
        return Book.collection().fetch({ withRelated: ['chapters'] }).then(function (books) {
          var relatedChapters = books.reduce(function (result, book) {
            return result.add(book.related('chapters').models);
          }, Chapter.collection());
          _expect.expect(_BookshelfStore2['default'].related(authors, 'books.chapters').pluck('id').sort()).to.deep.equal(relatedChapters.pluck('id').sort());
        });
      });
    });
  });

  describe('::toOneRelations', function () {

    it('should return an object representing toOne relations, keyed by the relation name with values being the column the relation is stored on', function () {
      _expect.expect(_BookshelfStore2['default'].toOneRelations(new Book())).to.deep.equal({ author: 'author_id' });
    });
  });

  describe('::type', function () {

    it('should be able to find the type name from a model class', function () {
      _expect.expect(_BookshelfStore2['default'].type(Book)).to.equal('books');
    });

    it('should be able to find the type name from a model instance', function () {
      _expect.expect(_BookshelfStore2['default'].type(new Book())).to.equal('books');
    });

    it('should prefer the static method typeName', function () {
      _expect.expect(_BookshelfStore2['default'].type(Store)).to.equal('STORES');
      _expect.expect(_BookshelfStore2['default'].type(new Store())).to.equal('STORES');
    });
  });

  describe('::serialize', function () {

    it('should serialize the model to a JSON object excluding relations', function () {
      return Author.forge({ id: 1 }).fetch({ withRelated: ['books'] }).then(function (author) {
        _expect.expect(_BookshelfStore2['default'].serialize(author)).to.deep.equal(_fantasyDatabase2['default'].authors[0]);
      });
    });
  });

  describe('::read', function () {

    it('should resolve with invalid relations removed', function () {
      return _BookshelfStore2['default'].read(Book, {
        id: 1,
        include: ['author', 'notarelation']
      }).then(function (book) {
        _expect.expect(book.relations).to.deep.equal(['author']);
      });
    });
  });
});