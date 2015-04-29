'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _adapterHas = require('../../lib/adapter_has');

var _adapterHas2 = _interopRequireDefault(_adapterHas);

describe('adapterHas', function () {
  it('should return undefined if there "request" argument', function () {
    _expect.expect(_adapterHas2['default']([1], null, 'number')).to.be.undefined;
  });

  it('should return an empty array if the members of the requested array is in the array', function () {
    _expect.expect(_adapterHas2['default']([1], [1], 'number')).to.be.an('array');
  });

  it('should return null if the requested item is an existing object property', function () {
    _expect.expect(_adapterHas2['default']({ '1': 'a' }, '1', 'property')).to.be['null'];
  });

  it('should return an error message if the requested item is not in the array', function () {
    _expect.expect(_adapterHas2['default']([1], [2], 'number')).to.match(/Model does not have/);
    _expect.expect(_adapterHas2['default']({ '1': 'a' }, '2', 'property')).to.match(/Model does not have/);
  });
});