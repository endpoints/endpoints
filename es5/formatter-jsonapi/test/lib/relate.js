"use strict";

/**const expect = require('chai').expect;
const database = require('fantasy-database');

const relate = require('../../lib/relate');

const DB = require('../../../../test/fixtures/classes/database');
const Stores = require('../../../../test/fixtures/models/stores');
const Authors = require('../../../../test/fixtures/models/stores');
const Books = require('../../../../test/fixtures/models/books');

function removePivot (input) {
  var serialized = input.toJSON({shallow:true});
  return Object.keys(serialized).reduce(function (result, key) {
    if (result[0] !== '_') {
      result[key] = serialized[key];
    }
    return result;
  }, {});
}

describe('relate', function () {

  before(function () {
    return DB.reset();
  });

  it('should get all requested hasMany relations for a single model', function () {
    return Stores.forge({id:2}).fetch({withRelated:['books']}).then(function (store) {
      expect(relate(store, 'books').map(removePivot)).to.deep.equal(database.books);
    });
  });

  it('should get all requested hasMany relations for a collection of models', function () {
    return Authors.collection().fetch({withRelated:'books'}).then(function (authors) {
      var books = relate(authors, 'books');
      books.forEach(function (authorsBooks, idx) {
        expect(authors.at(idx).related('books')).to.equal(authorsBooks);
      });
    });
  });

  it('should get all requested hasOne relations for a single model', function () {
    return Books.forge({id:1}).fetch({withRelated:['author']}).then(function (book) {
      var author = relate(book, 'author');
      expect(author).to.deep.equal(book.related('author'));
    });
  });

  it('should get all requested hasOne relations for a collection of models', function () {
    return Books.collection().fetch({withRelated:['author']}).then(function (books) {
      var authors = relate(books, 'author');
      books.forEach(function (book, idx) {
        expect(book.related('author')).to.deep.equal(authors[idx]);
      });
    });
  });

  it('should return the last relation in a nested relation key', function () {
    return Stores.forge({id:2}).fetch({withRelated:['books.author']}).then(function (store) {
      relate(store, 'books.author').forEach(function (author, idx) {
        expect(store.related('books').at(idx).related('author')).to.deep.equal(author);
      });
    });
  });

});
*/