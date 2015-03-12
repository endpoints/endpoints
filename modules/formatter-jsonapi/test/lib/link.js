const sinon = require('sinon');
const expect = require('chai').expect;
const _ = require('lodash');
const fantasyDatabase = require('fantasy-database');

const link = require('../../lib/link');

const App = require('../../../../test/app');
const Books = require('../../../../test/app/src/modules/books/model');
const Authors = require('../../../../test/app/src/modules/authors/model');

describe('link', function () {

  var booksModel, authorsModel;
  var booksByAuthorOne = _.chain(fantasyDatabase.books).filter({author_id:1}).pluck('id').map(function(i) {return String(i);}).value();

  before(function () {
    return App.reset().then(function () {
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
        id: booksByAuthorOne
      },
      self: '/authors/1'
    });
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
      toOneWithoutInclude: ['author'],
    })).to.deep.equal({
      author: {
        resource: '/authors/1',
        id: '1',
        type: 'authors'
      },
      self: '/books/11'
    });
  });

  it('should handle null toOne link entries for a model', function () {
    expect(link(booksModel, {
      toOneWithoutInclude: ['series']
    })).to.deep.equal({
      series: {
        id: 'null',
        type: 'series'
      },
      self: '/books/11'
    });
  });

});
