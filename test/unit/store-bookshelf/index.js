/* jshint ignore:start */

import path from 'path';
import {expect} from 'chai';
import _ from 'lodash';

import knex from 'knex';
import bookshelf from 'bookshelf';
import fantasyDatabase from 'fantasy-database';

import BookshelfStore from '../../../src/store-bookshelf';

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
  books() {
    return this.hasMany(Book);
  }
}, {
  filters: {},
  relations: [
    'books',
    'books.chapters',
    'books.stores'
  ]
});

const Book = Bookshelf.Model.extend({
  tableName: 'books',
  author() {
    return this.belongsTo(Author);
  },
  chapters() {
    return this.hasMany(Chapter);
  },
  stores() {
    return this.belongsToMany(Store);
  }
}, {
  filters: {},
  relations: [
    'author',
    'chapters',
    'stores'
  ]
});

const Chapter = Bookshelf.Model.extend({
  tableName: 'chapters',
  book() {
    return this.belongsTo(Book);
  },
}, {
  filters: {},
  relations: [
    'book'
  ]
});

const Store = Bookshelf.Model.extend({
  tableName: 'stores',
  books() {
    return this.belongsToMany(Book);
  }
}, {
  filters: {},
  typeName: 'STORES',
  relations: [
    'books',
    'books.author'
  ]
});

describe('JsonApiBookshelf', () => {

  describe('::allRelations', () => {

    it('should be able to find the valid relations from a model class', () => {
      expect(BookshelfStore.allRelations(Book)).to.equal(Book.relations);
    });

    it('should be able to find the valid relations from a model instance', () => {
      expect(BookshelfStore.allRelations(new Book())).to.equal(Book.relations);

    });

  });

  describe('::id', () => {

    it('should return the id attribute of a model', () => {
      const id = '1100';
      expect(BookshelfStore.id(new Book({id:id}))).to.equal(id);
    });

  });

  describe('::isMany', () => {

    it('should be able to differentiate between a bookshelf collection and model', () => {
      expect(BookshelfStore.isMany(new Book())).to.be.false;
      expect(BookshelfStore.isMany(Book.collection())).to.be.true;

    });
  });

  describe('::modelsFromCollection', () => {

    it('should be able to return just the models from a collection', () => {
      var book = new Book({id:1});
      var Books = Book.collection().add(book);
      expect(BookshelfStore.modelsFromCollection(Books)).to.deep.equal([book]);
    });

  });

  describe('::related', () => {

    it('should return a single model related to another model', () => {
      return Book.forge({id:1}).fetch({withRelated:['author']}).then((book) => {
        return Author.forge({id:book.get('author_id')}).fetch().then((author) => {
          expect(BookshelfStore.related(book, 'author').toJSON()).to.deep.equal(author.toJSON());
        });
      });
    });

    it('should return a collection of models related to a single model', () => {
      return Author.forge({id:1}).fetch({withRelated:['books']}).then((author) => {
        return Book.collection().query((qb) => {
          return qb.where({author_id:1});
        }).fetch().then((books) => {
          expect(BookshelfStore.related(author, 'books').toJSON()).to.deep.equal(books.toJSON());
        });
      });
    });

    it('should return a collection of models related to a collection of models', () => {
      return Book.collection().fetch({withRelated:['author']}).then((books) => {
        return Author.collection().fetch().then((authors) => {
          expect(BookshelfStore.related(books, 'author').toJSON()).to.deep.equal(authors.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a single model', () => {
      return Author.forge({id:1}).fetch({withRelated:['books.chapters']}).then((author) => {
        return Book.collection().query((qb) => {
          return qb.where({author_id:1});
        }).fetch({withRelated:['chapters']}).then((books) => {
          const relatedChapters = books.reduce((result, book) => {
            return result.add(book.related('chapters').models);
          }, Chapter.collection());
          expect(BookshelfStore.related(author, 'books.chapters').toJSON()).to.deep.equal(relatedChapters.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a collection of models', () => {
      return Author.collection().fetch({withRelated:['books.chapters']}).then((authors) => {
        return Book.collection().fetch({withRelated:['chapters']}).then((books) => {
          const relatedChapters = books.reduce((result, book) => {
            return result.add(book.related('chapters').models);
          }, Chapter.collection());
          expect(BookshelfStore.related(authors, 'books.chapters').pluck('id').sort()).to.deep.equal(relatedChapters.pluck('id').sort());
        });
      });
    });

  });

  describe('::toOneRelations', () => {

    it('should return an object representing toOne relations, keyed by the relation name with values being the column the relation is stored on', () => {
      expect(BookshelfStore.toOneRelations(new Book())).to.deep.equal({author:'author_id'});
    });

  });

  describe('::type', () => {

    it('should be able to find the type name from a model class', () => {
      expect(BookshelfStore.type(Book)).to.equal('books');
    });

    it('should be able to find the type name from a model instance', () => {
      expect(BookshelfStore.type(new Book())).to.equal('books');
    });

    it('should prefer the static method typeName', () => {
      expect(BookshelfStore.type(Store)).to.equal('STORES');
      expect(BookshelfStore.type(new Store())).to.equal('STORES');
    });

  });

  describe('::serialize', () => {

    it('should serialize the model to a JSON object excluding relations', () => {
      return Author.forge({id:1}).fetch({withRelated:['books']}).then((author) => {
        var json = _.omit(BookshelfStore.serialize(author), ['created_at', 'updated_at']);
        expect(json).to.deep.equal(fantasyDatabase.authors[0]);
      });
    });

  });

  describe('::read', () => {

    it('should only return one', () => {
      return BookshelfStore.read(Book, {
        filter: { id: 1 }
      }).then((book) => {
        expect(book.length).to.equal(1);
      });
    });

    it('should resolve with invalid relations removed', () => {
      return BookshelfStore.read(Book, {
        filter: { id: 1 },
        include: ['author', 'notarelation']
      }).then((book) => {
        expect(book.relations).to.deep.equal(['author']);
      });
    });

  });

});

/* jshint ignore:end */
