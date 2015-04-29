'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _expect = require('chai');

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _fantasyDatabase = require('fantasy-database');

var _fantasyDatabase2 = _interopRequireDefault(_fantasyDatabase);

var _link = require('../../lib/link');

var _link2 = _interopRequireDefault(_link);

var _Fixture = require('../../../../test/app/fixture');

var _Fixture2 = _interopRequireDefault(_Fixture);

var _Books = require('../../../../test/app/src/modules/books/model');

var _Books2 = _interopRequireDefault(_Books);

var _Authors = require('../../../../test/app/src/modules/authors/model');

var _Authors2 = _interopRequireDefault(_Authors);

describe('link', function () {

  var booksModel, authorsModel;
  var booksByAuthorOne = _import2['default'].chain(_fantasyDatabase2['default'].books).filter({ author_id: 1 }).pluck('id').map(function (i) {
    return String(i);
  }).value();

  before(function () {
    return _Fixture2['default'].reset().then(function () {
      return new _Books2['default']({ id: 11 }).fetch({
        withRelated: _Books2['default'].relations
      }).then(function (result) {
        booksModel = result;
      });
    }).then(function () {
      return new _Authors2['default']({ id: 1 }).fetch({
        withRelated: _Authors2['default'].relations
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

    result.books.linkage = _import2['default'].reduce(booksByAuthorOne, function (res, authorId) {
      res.push({
        id: authorId,
        type: 'books'
      });
      return res;
    }, []);

    _expect.expect(_link2['default'](authorsModel, {
      linkWithInclude: ['books'] })).to.deep.equal(result);
  });

  it('should call exporter for each included model', function () {
    var spy = _sinon2['default'].spy();
    _link2['default'](authorsModel, {
      linkWithInclude: ['books'],
      exporter: spy
    });
    _expect.expect(spy.callCount).to.equal(4);
  });

  it('should generate toOne links entries for a model', function () {
    _expect.expect(_link2['default'](booksModel, {
      linkWithoutInclude: ['author'] })).to.deep.equal({
      author: {
        self: '/books/11/links/author',
        related: '/books/11/author'
      },
      self: '/books/11'
    });
  });

  it('should handle null toOne link entries for a model', function () {
    _expect.expect(_link2['default'](booksModel, {
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