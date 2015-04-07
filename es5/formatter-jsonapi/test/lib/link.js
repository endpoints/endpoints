'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var _ = require('lodash');
var fantasyDatabase = require('fantasy-database');

var link = require('../../lib/link');

var Fixture = require('../../../../test/app/fixture');
var Books = require('../../../../test/app/src/modules/books/model');
var Authors = require('../../../../test/app/src/modules/authors/model');

describe('link', function () {

  var booksModel, authorsModel;
  var booksByAuthorOne = _.chain(fantasyDatabase.books).filter({ author_id: 1 }).pluck('id').map(function (i) {
    return String(i);
  }).value();

  before(function () {
    return Fixture.reset().then(function () {
      return new Books({ id: 11 }).fetch({
        withRelated: Books.relations
      }).then(function (result) {
        booksModel = result;
      });
    }).then(function () {
      return new Authors({ id: 1 }).fetch({
        withRelated: Authors.relations
      }).then(function (result) {
        authorsModel = result;
      });
    });
  });

  it('should generate links object for a model', function () {
    var result = {
      books: {
        self: '/authors/1/links/books',
        related: '/authors/1/books' },
      self: '/authors/1'
    };

    result.books.linkage = _.reduce(booksByAuthorOne, function (res, authorId) {
      res.push({
        id: authorId,
        type: 'books'
      });
      return res;
    }, []);

    expect(link(authorsModel, {
      linkWithInclude: ['books'] })).to.deep.equal(result);
  });

  it('should call exporter for each included model', function () {
    var spy = sinon.spy();
    link(authorsModel, {
      linkWithInclude: ['books'],
      exporter: spy
    });
    expect(spy.callCount).to.equal(4);
  });

  it('should generate toOne links entries for a model', function () {
    expect(link(booksModel, {
      linkWithoutInclude: ['author'] })).to.deep.equal({
      author: {
        self: '/books/11/links/author',
        related: '/books/11/author'
      },
      self: '/books/11'
    });
  });

  it('should handle null toOne link entries for a model', function () {
    expect(link(booksModel, {
      linkWithoutInclude: ['series']
    })).to.deep.equal({
      series: {
        self: '/books/11/links/series',
        related: '/books/11/series'
      },
      self: '/books/11'
    });
  });
});