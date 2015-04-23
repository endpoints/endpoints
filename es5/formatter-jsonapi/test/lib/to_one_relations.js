'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _toOneRelations = require('../../lib/to_one_relations');

var _toOneRelations2 = _interopRequireWildcard(_toOneRelations);

var _Fixture = require('../../../../test/app/fixture');

var _Fixture2 = _interopRequireWildcard(_Fixture);

var _Books = require('../../../../test/app/src/modules/books/model');

var _Books2 = _interopRequireWildcard(_Books);

describe('toOneRelations', function () {

  var model;

  before(function () {
    return _Fixture2['default'].reset().then(function () {
      return new _Books2['default']({ id: 1 }).fetch().then(function (result) {
        model = result;
      });
    });
  });

  it('should return an empty object if invalid relations are provided', function () {
    _expect.expect(_toOneRelations2['default'](model)).to.deep.equal({});
  });

  it('should return an object describing the to-one relations on a model', function () {
    _expect.expect(_toOneRelations2['default'](model, ['author'])).to.deep.equal({
      author: 'author_id'
    });
  });

  it('should ignore nested relations', function () {
    _expect.expect(_toOneRelations2['default'](model, ['author', 'author.books'])).to.deep.equal({
      author: 'author_id'
    });
  });

  it('should throw on invalid relations', function () {
    _expect.expect(function () {
      _toOneRelations2['default'](model, ['invalid']);
    }).to['throw'];
  });
});