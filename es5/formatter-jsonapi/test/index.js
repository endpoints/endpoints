'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _BookshelfAdapter = require('../../adapter-bookshelf');

var _BookshelfAdapter2 = _interopRequireWildcard(_BookshelfAdapter);

var _BooksModel = require('../../../test/app/src/modules/books/model');

var _BooksModel2 = _interopRequireWildcard(_BooksModel);

var _Fixture = require('../../../test/app/fixture');

var _Fixture2 = _interopRequireWildcard(_Fixture);

var _formatter = require('../');

var _formatter2 = _interopRequireWildcard(_formatter);

var Books = new _BookshelfAdapter2['default']({
  model: _BooksModel2['default']
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
    return _Fixture2['default'].reset();
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
      _expect.expect(_formatter2['default'](book, opts)).to.be.an('object');
    });
  });

  it('should accept a collection and return an object', function () {
    return Books.read().then(function (books) {
      _expect.expect(books).to.have.property('length');
      _expect.expect(_formatter2['default'](books, opts)).to.be.an('object');
    });
  });

  it('should accept a single-item collection and return an object', function () {
    opts.singleResult = true;
    return Books.read().then(function (books) {
      var coll = _BooksModel2['default'].collection([books.at(0)]);
      _expect.expect(coll.length).to.equal(1);
      _expect.expect(_formatter2['default'](coll, opts)).to.be.an('object');
    });
  });
});