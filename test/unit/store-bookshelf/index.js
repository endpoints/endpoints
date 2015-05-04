import path from 'path';
import {expect} from 'chai';

import knex from 'knex';
import bookshelf from 'bookshelf';
import fantasyDatabase from 'fantasy-database';

import BookshelfStore from '../../src/store-bookshelf';

const Bookshelf = bookshelf(knex({
  client: 'sqlite3',
  debug: false,
  connection: {
    filename: path.join(
      path.dirname(require.resolve('fantasy-database')),
      'fantasy.db'
    )
  }
}));

const Author = Bookshelf.Model.extend({
  tableName: 'authors',
  books: function () {
    return this.hasMany(Book);
  }
}, {
  relations: [
    'books',
    'books.chapters',
    'books.stores'
  ]
});

const Book = Bookshelf.Model.extend({
  tableName: 'books',
  author: function () {
    return this.belongsTo(Author);
  },
  chapters: function () {
    return this.hasMany(Chapter);
  },
  stores: function () {
    return this.belongsToMany(Store);
  }
}, {
  relations: [
    'author',
    'chapters',
    'stores'
  ]
});

const Chapter = Bookshelf.Model.extend({
  tableName: 'chapters',
  book: function () {
    return this.belongsTo(Book);
  },
}, {
  relations: [
    'book'
  ]
});

const Store = Bookshelf.Model.extend({
  tableName: 'stores',
  books: function () {
    return this.belongsToMany(Book);
  }
}, {
  typeName: 'STORES',
  relations: [
    'books',
    'books.author'
  ]
});

describe('JsonApiBookshelf', function () {

  describe('::allRelations', function () {

    it('should be able to find the valid relations from a model class', function () {
      expect(BookshelfStore.allRelations(Book)).to.equal(Book.relations);
    });

    it('should be able to find the valid relations from a model instance', function () {
      expect(BookshelfStore.allRelations(new Book())).to.equal(Book.relations);

    });

  });

  describe('::id', function () {

    it('should return the id attribute of a model', function () {
      const id = 1100;
      expect(BookshelfStore.id(new Book({id:id}))).to.equal(id);
    });

  });

  describe('::isMany', function () {

    it('should be able to differentiate between a bookshelf collection and model', function () {
      expect(BookshelfStore.isMany(new Book())).to.be.false;
      expect(BookshelfStore.isMany(Book.collection())).to.be.true;

    });
  });

  describe('::modelsFromCollection', function () {

    it('should be able to return just the models from a collection', function () {
      var book = new Book({id:1});
      var Books = Book.collection().add(book);
      expect(BookshelfStore.modelsFromCollection(Books)).to.deep.equal([book]);
    });

  });

  describe('::related', function () {

    it('should return a single model related to another model', function () {
      return Book.forge({id:1}).fetch({withRelated:['author']}).then(function (book) {
        return Author.forge({id:book.get('author_id')}).fetch().then(function (author) {
          expect(BookshelfStore.related(book, 'author').toJSON()).to.deep.equal(author.toJSON());
        });
      });
    });

    it('should return a collection of models related to a single model', function () {
      return Author.forge({id:1}).fetch({withRelated:['books']}).then(function (author) {
        return Book.collection().query(function (qb) {
          return qb.where({author_id:1});
        }).fetch().then(function (books) {
          expect(BookshelfStore.related(author, 'books').toJSON()).to.deep.equal(books.toJSON());
        });
      });
    });

    it('should return a collection of models related to a collection of models', function () {
      return Book.collection().fetch({withRelated:['author']}).then(function (books) {
        return Author.collection().fetch().then(function (authors) {
          expect(BookshelfStore.related(books, 'author').toJSON()).to.deep.equal(authors.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a single model', function () {
      return Author.forge({id:1}).fetch({withRelated:['books.chapters']}).then(function (author) {
        return Book.collection().query(function (qb) {
          return qb.where({author_id:1});
        }).fetch({withRelated:['chapters']}).then(function (books) {
          const relatedChapters = books.reduce(function (result, book) {
            return result.add(book.related('chapters').models);
          }, Chapter.collection());
          expect(BookshelfStore.related(author, 'books.chapters').toJSON()).to.deep.equal(relatedChapters.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a collection of models', function () {
      return Author.collection().fetch({withRelated:['books.chapters']}).then(function (authors) {
        return Book.collection().fetch({withRelated:['chapters']}).then(function (books) {
          const relatedChapters = books.reduce(function (result, book) {
            return result.add(book.related('chapters').models);
          }, Chapter.collection());
          expect(BookshelfStore.related(authors, 'books.chapters').pluck('id').sort()).to.deep.equal(relatedChapters.pluck('id').sort());
        });
      });
    });

  });

  describe('::toOneRelations', function () {

    it('should return an object representing toOne relations, keyed by the relation name with values being the column the relation is stored on', function () {
      expect(BookshelfStore.toOneRelations(new Book())).to.deep.equal({author:'author_id'});
    });

  });

  describe('::type', function () {

    it('should be able to find the type name from a model class', function () {
      expect(BookshelfStore.type(Book)).to.equal('books');
    });

    it('should be able to find the type name from a model instance', function () {
      expect(BookshelfStore.type(new Book())).to.equal('books');
    });

    it('should prefer the static method typeName', function () {
      expect(BookshelfStore.type(Store)).to.equal('STORES');
      expect(BookshelfStore.type(new Store())).to.equal('STORES');
    });

  });

  describe('::serialize', function () {

    it('should serialize the model to a JSON object excluding relations', function () {
      return Author.forge({id:1}).fetch({withRelated:['books']}).then(function (author) {
        expect(BookshelfStore.serialize(author)).to.deep.equal(fantasyDatabase.authors[0]);
      });
    });

  });

  describe('::read', function () {

    it('should resolve with invalid relations removed', function () {
      return BookshelfStore.read(Book, {
        id: 1,
        include: ['author', 'notarelation']
      }).then(function (book) {
        expect(book.relations).to.deep.equal(['author']);
      });
    });

  });

});
