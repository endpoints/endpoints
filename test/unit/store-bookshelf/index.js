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

const Models = {
  Author: Bookshelf.Model.extend({
    tableName: 'authors',
    books() {
      return this.hasMany(Models.Book);
    },
  }, {
    filters: {},
    relations: [
      'books',
      'books.chapters',
      'books.stores'
    ],
    transaction: Bookshelf.transaction.bind(Bookshelf),
  }),
  Book: Bookshelf.Model.extend({
    tableName: 'books',
    author() {
      return this.belongsTo(Models.Author);
    },
    chapters() {
      return this.hasMany(Models.Chapter);
    },
    stores() {
      return this.belongsToMany(Models.Store);
    }
  }, {
    filters: {},
    relations: [
      'author',
      'chapters',
      'stores'
    ],
    transaction: Bookshelf.transaction.bind(Bookshelf),
  }),
  Chapter: Bookshelf.Model.extend({
    tableName: 'chapters',
    book() {
      return this.belongsTo(Models.Book);
    },
  }, {
    filters: {},
    relations: [
      'book'
    ],
    transaction: Bookshelf.transaction.bind(Bookshelf),
  }),
  Store: Bookshelf.Model.extend({
    tableName: 'stores',
    books() {
      return this.belongsToMany(Models.Book);
    }
  }, {
    filters: {},
    typeName: 'STORES',
    relations: [
      'books',
      'books.author'
    ],
    transaction: Bookshelf.transaction.bind(Bookshelf),
  }),
};

describe('JsonApiBookshelf', () => {

  describe('lib', () => {
    require('./lib/_read_for_related')(Models);
    require('./lib/_transact');
    require('./lib/all_relations');
    require('./lib/by_id');
    require('./lib/columns');
    require('./lib/create')(Models);
    require('./lib/create_relation')(Models);
    require('./lib/destroy');
    require('./lib/destroy_relation');
    require('./lib/destructure');
    require('./lib/filters');
    require('./lib/id');
    require('./lib/is_many');
    require('./lib/models_from_collection');
    require('./lib/prop');
    require('./lib/read');
    require('./lib/relate');
    require('./lib/related');
    require('./lib/related_collection');
    require('./lib/related_model');
    require('./lib/serialize');
    require('./lib/to_one_relations');
    require('./lib/type');
    require('./lib/update');
  });

  describe('::allRelations', () => {

    it('should be able to find the valid relations from a model class', () => {
      expect(BookshelfStore.allRelations(Models.Book)).to.equal(Models.Book.relations);
    });

    it('should be able to find the valid relations from a model instance', () => {
      expect(BookshelfStore.allRelations(new Models.Book())).to.equal(Models.Book.relations);

    });

  });

  describe('::id', () => {

    it('should return the id attribute of a model', () => {
      const id = '1100';
      expect(BookshelfStore.id(new Models.Book({id:id}))).to.equal(id);
    });

  });

  describe('::isMany', () => {

    it('should be able to differentiate between a bookshelf collection and model', () => {
      expect(BookshelfStore.isMany(new Models.Book())).to.be.false;
      expect(BookshelfStore.isMany(Models.Book.collection())).to.be.true;

    });
  });

  describe('::modelsFromCollection', () => {

    it('should be able to return just the models from a collection', () => {
      var book = new Models.Book({id:1});
      var Books = Models.Book.collection().add(book);
      expect(BookshelfStore.modelsFromCollection(Books)).to.deep.equal([book]);
    });

  });

  describe('::related', () => {

    it('should return a single model related to another model', () => {
      return Models.Book.forge({id:1}).fetch({withRelated:['author']}).then((book) => {
        return Models.Author.forge({id:book.get('author_id')}).fetch().then((author) => {
          expect(BookshelfStore.related(book, 'author').toJSON()).to.deep.equal(author.toJSON());
        });
      });
    });

    it('should return a collection of models related to a single model', () => {
      return Models.Author.forge({id:1}).fetch({withRelated:['books']}).then((author) => {
        return Models.Book.collection().query((qb) => {
          return qb.where({author_id:1});
        }).fetch().then((books) => {
          expect(BookshelfStore.related(author, 'books').toJSON()).to.deep.equal(books.toJSON());
        });
      });
    });

    it('should return a collection of models related to a collection of models', () => {
      return Models.Book.collection().fetch({withRelated:['author']}).then((books) => {
        return Models.Author.collection().fetch().then((authors) => {
          expect(BookshelfStore.related(books, 'author').toJSON()).to.deep.equal(authors.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a single model', () => {
      return Models.Author.forge({id:1}).fetch({withRelated:['books.chapters']}).then((author) => {
        return Models.Book.collection().query((qb) => {
          return qb.where({author_id:1});
        }).fetch({withRelated:['chapters']}).then((books) => {
          const relatedChapters = books.reduce((result, book) => {
            return result.add(book.related('chapters').models);
          }, Models.Chapter.collection());
          expect(BookshelfStore.related(author, 'books.chapters').toJSON()).to.deep.equal(relatedChapters.toJSON());
        });
      });
    });

    it('should return a collection of models from a nested relation on a collection of models', () => {
      return Models.Author.collection().fetch({withRelated:['books.chapters']}).then((authors) => {
        return Models.Book.collection().fetch({withRelated:['chapters']}).then((books) => {
          const relatedChapters = books.reduce((result, book) => {
            return result.add(book.related('chapters').models);
          }, Models.Chapter.collection());
          expect(BookshelfStore.related(authors, 'books.chapters').pluck('id').sort()).to.deep.equal(relatedChapters.pluck('id').sort());
        });
      });
    });

  });

  describe('::toOneRelations', () => {

    it('should return an object representing toOne relations, keyed by the relation name with values being the column the relation is stored on', () => {
      expect(BookshelfStore.toOneRelations(new Models.Book())).to.deep.equal({author:'author_id'});
    });

  });

  describe('::type', () => {

    it('should be able to find the type name from a model class', () => {
      expect(BookshelfStore.type(Models.Book)).to.equal('books');
    });

    it('should be able to find the type name from a model instance', () => {
      expect(BookshelfStore.type(new Models.Book())).to.equal('books');
    });

    it('should prefer the static method typeName', () => {
      expect(BookshelfStore.type(Models.Store)).to.equal('STORES');
      expect(BookshelfStore.type(new Models.Store())).to.equal('STORES');
    });

  });

  describe('::serialize', () => {

    it('should serialize the model to a JSON object excluding relations', () => {
      return Models.Author.forge({id:1}).fetch({withRelated:['books']}).then((author) => {
        var json = _.omit(BookshelfStore.serialize(author), ['created_at', 'updated_at']);
        expect(json).to.deep.equal(fantasyDatabase.authors[0]);
      });
    });

  });

  describe('::read', () => {

    it('should only return one', () => {
      return BookshelfStore.read(Models.Book, {
        filter: { id: 1 }
      }).then((book) => {
        expect(book.length).to.equal(1);
      });
    });

    it('should resolve with invalid relations removed', () => {
      return BookshelfStore.read(Models.Book, {
        filter: { id: 1 },
        include: ['author', 'notarelation']
      }).then((book) => {
        expect(book.relations).to.deep.equal(['author']);
      });
    });

  });

});
