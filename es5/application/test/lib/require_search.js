'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _expect = require('chai');

var _requireSearch = require('../../lib/require_search');

var _requireSearch2 = _interopRequireWildcard(_requireSearch);

describe('requireSearch', function () {
  var searchPaths = [_path2['default'].join(__dirname, '..', 'fixtures'), _path2['default'].resolve()];
  var pkg = _path2['default'].resolve('./package.json');

  it('should throw if no searchPaths are specified', function () {
    _expect.expect(function () {
      _requireSearch2['default']('file');
    }).to['throw'](/No searchPaths/);
  });

  it('should require a file, looking in multiple locations to find it', function () {
    _expect.expect(_requireSearch2['default']('package.json', searchPaths)).to.equal(pkg);
  });

  it('should throw if the file cannot be located in any of the search paths', function () {
    _expect.expect(function () {
      _requireSearch2['default']('bad-file', searchPaths);
    }).to['throw'](/Unable to locate/);
  });

  it('should throw if the file is located but cannot be required', function () {
    _expect.expect(function () {
      _requireSearch2['default']('invalid', searchPaths);
    }).to['throw'](Error);
    _expect.expect(function () {
      _requireSearch2['default']('depends_on_missing', searchPaths);
    }).to['throw'](/Cannot find/);
  });
});