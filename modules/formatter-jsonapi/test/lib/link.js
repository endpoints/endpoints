const sinon = require('sinon');
const expect = require('chai').expect;
const _ = require('lodash');
const fantasyDatabase = require('fantasy-database');

const link = require('../../lib/link');

const DB = require('../../../../test/fixtures/classes/database');
const Books = require('../../../../test/fixtures/models/books');
const Authors = require('../../../../test/fixtures/models/authors');

describe('link', function () {

  var booksModel, authorsModel;
  var booksByAuthorOne = _.chain(fantasyDatabase.books).filter({author_id:1}).pluck('id').map(function(i) {return String(i);}).value();

  before(function () {
    return DB.reset().then(function () {
      return new Books({id:11}).fetch({
        withRelated: Books.relations
      }).then(function (result) {
        booksModel = result;
      });
    }).then(function () {
      return new Authors({id:1}).fetch({
        withRelated: Authors.relations
      }).then(function (result) {
        authorsModel = result;
      });
    });
  });

  it('should generate links object for a model', function () {
    expect(link(authorsModel, {
      linkWithInclude: ['books'],
    })).to.deep.equal({
      books: {
        type: 'books',
        ids: booksByAuthorOne
      }
    });
  });

  it('should call exporter for each included link', function () {
    var spy = sinon.spy();
    link(authorsModel, {
      linkWithInclude: ['books', 'books.series'],
      exporter: spy
    });
    expect(spy.callCount).to.equal(2);
  });

  it('should generate toOne links entries for a model', function () {
    expect(link(booksModel, {
      toOneWithoutInclude: ['author'],
    })).to.deep.equal({
      author: {
        href: '/authors/1',
        id: '1',
        type: 'authors'
      }
    });
  });

  it('should handle null toOne link entries for a model', function () {
    expect(link(booksModel, {
      toOneWithoutInclude: ['series']
    })).to.deep.equal({
      series: {
        id: 'null',
        type: 'series'
      }
    });
  });

});
