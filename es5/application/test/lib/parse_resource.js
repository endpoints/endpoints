'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expect = require('chai');

var _parseResource = require('../../lib/parse_resource');

var _parseResource2 = _interopRequireDefault(_parseResource);

describe('parseResource', function () {

  it('should find a routes file in search paths and return a resource object', function () {
    var searchPaths = [_path2['default'].join(__dirname, '..', 'fixtures', 'resources')];
    _expect.expect(_parseResource2['default']('foo', searchPaths)).to.deep.equal({
      name: 'foo',
      routes: require('../fixtures/resources/foo/routes'),
      controller: require('../fixtures/resources/foo/controller')
    });
  });

  it('should throw if a custom resource is defined without a name', function () {
    _expect.expect(function () {
      _parseResource2['default']();
    }).to['throw']('Unable to parse a module without a name.');
    _expect.expect(function () {
      _parseResource2['default']({});
    }).to['throw']('Unable to parse a module without a name.');
  });

  it('should throw if a custom resource is defined without a routes object', function () {
    _expect.expect(function () {
      _parseResource2['default']({ name: 'test' });
    }).to['throw']('Unable to parse a module without a routes object.');
  });

  it('should pass custom module through', function () {
    var moduleDefinition = {
      name: 'test',
      routes: {
        get: {
          '/': function _(request, response) {
            response.send(200);
          }
        }
      }
    };
    _expect.expect(_parseResource2['default'](moduleDefinition)).to.deep.equal(moduleDefinition);
  });
});