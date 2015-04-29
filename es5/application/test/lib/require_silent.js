'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expect = require('chai');

var _requireSilent = require('../../lib/require_silent');

var _requireSilent2 = _interopRequireDefault(_requireSilent);

describe('requireSilent', function () {

  it('should require a file', function () {
    var packagePath = _path2['default'].resolve('./package');
    _expect.expect(_requireSilent2['default'](packagePath)).to.deep.equal(require(packagePath));
  });

  it('should not throw if file is not found', function () {
    _expect.expect(function () {
      _requireSilent2['default']('path/to/nowhere');
    }).to.not['throw'];
  });

  it('should return error if file is not found', function () {
    _expect.expect(_requireSilent2['default']('path/to/nowhere')).to.be.an['instanceof'](Error);
  });
});