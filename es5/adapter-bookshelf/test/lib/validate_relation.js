'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _DB = require('../../../../test/fixtures/classes/database');

var _DB2 = _interopRequireDefault(_DB);

var _BooksModel = require('../../../../test/fixtures/models/books');

var _BooksModel2 = _interopRequireDefault(_BooksModel);

var _validateRelation = require('../../lib/validate_relation');

var _validateRelation2 = _interopRequireDefault(_validateRelation);

describe('validateRelation', function () {
  var model;
  before(function () {
    return _DB2['default'].reset().then(function () {
      _BooksModel2['default'].forge({ id: 1 }).fetch({
        withRelated: ['author', 'chapters']
      }).then(function (book) {
        model = book;
      });
    });
  });

  it('should throw if requested relation doesn\'t exist for model', function () {
    return _expect.expect(_validateRelation2['default'](model, 'nope')).to.be.rejectedWith(/Unable to find/);
  });

  it('should fullfill when setting a toOne relationship to null', function () {
    return _expect.expect(_validateRelation2['default'](model, 'author', null)).to.be.fulfilled;
  });

  it('should fullfill when setting a toOne relationship to a valid relation', function () {
    return _expect.expect(_validateRelation2['default'](model, 'author', 2)).to.be.fulfilled;
  });

  it('should throw when setting a toOne relationship to a invalid relation', function () {
    return _expect.expect(_validateRelation2['default'](model, 'author', 100)).to.be.rejectedWith(/Unable to find/);
  });

  it('should ??? when setting a toMany relation to null');

  it('should fullfill when setting a toMany relationship to []', function () {
    return _expect.expect(_validateRelation2['default'](model, 'chapters', [])).to.be.fulfilled;
  });

  it('should fullfill when setting a toMany relationship to a valid relation', function () {
    return _expect.expect(_validateRelation2['default'](model, 'chapters', [1, 2])).to.be.fulfilled;
  });

  it('should throw when setting a toMany relationship if any relations are missing', function () {
    return _expect.expect(_validateRelation2['default'](model, 'chapters', [10000])).to.be.rejectedWith(/Unable to find/);
  });
});