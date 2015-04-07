'use strict';

var expect = require('chai').expect;

var BookshelfAdapter = require('../../adapter-bookshelf');
var BooksModel = require('../../../test/app/src/modules/books/model');
var Fixture = require('../../../test/app/fixture');

var formatter = require('../');

var Books = new BookshelfAdapter({
  model: BooksModel
});

describe('formatter-jsonapi', function () {

  describe('lib', function () {
    require('./lib/link');
    require('./lib/relate');
    require('./lib/to_one_relations');
    require('./lib/format_model');
  });

  var opts;

  before(function () {
    return Fixture.reset();
  });

  beforeEach(function () {
    opts = {};
  });

  it('should accept a model and return an object', function () {
    return Books.create('create', {
      author_id: 1,
      title: 'test book',
      date_published: '2015-02-01'
    }).then(function (book) {
      expect(formatter(book, opts)).to.be.an('object');
    });
  });

  it('should accept a collection and return an object', function () {
    return Books.read().then(function (books) {
      expect(books).to.have.property('length');
      expect(formatter(books, opts)).to.be.an('object');
    });
  });

  it('should accept a single-item collection and return an object', function () {
    opts.singleResult = true;
    return Books.read().then(function (books) {
      var coll = BooksModel.collection([books.at(0)]);
      expect(coll.length).to.equal(1);
      expect(formatter(coll, opts)).to.be.an('object');
    });
  });
});