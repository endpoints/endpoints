'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _throwIfNoModel = require('../../lib/throw_if_no_model');

var _throwIfNoModel2 = _interopRequireDefault(_throwIfNoModel);

describe('throwIfNoModel', function () {
  it('should throw if not passed an argument', function () {
    _expect.expect(function () {
      _throwIfNoModel2['default']();
    }).to['throw'](/Unable/);
  });

  it('should throw if passed an error', function () {
    _expect.expect(function () {
      _throwIfNoModel2['default'](new Error());
    }).to['throw']();
    // keep? these rely on internal implementation details
    _expect.expect(function () {
      _throwIfNoModel2['default'](new Error('No rows were affected'));
    }).to['throw']();
    _expect.expect(function () {
      _throwIfNoModel2['default'](new Error('Unable to locate model.'));
    }).to['throw']();
  });

  it('should not throw if passed a non-error argument', function () {
    _expect.expect(function () {
      _throwIfNoModel2['default']({});
    }).to.not['throw']();
  });
});