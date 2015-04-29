'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _throwIfModel = require('../../lib/throw_if_model');

var _throwIfModel2 = _interopRequireDefault(_throwIfModel);

describe('throwIfModel', function () {
  it('should throw if passed an argument', function () {
    _expect.expect(function () {
      _throwIfModel2['default']({});
    }).to['throw'](/Model/);
  });

  it('should not throw if not passed an argument', function () {
    _expect.expect(function () {
      _throwIfModel2['default']();
    }).to.not['throw']();
  });
});