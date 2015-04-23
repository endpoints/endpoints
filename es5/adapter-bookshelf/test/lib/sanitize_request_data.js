'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _sanitizeRequestData = require('../../lib/sanitize_request_data');

var _sanitizeRequestData2 = _interopRequireWildcard(_sanitizeRequestData);

describe('sanitizeRequestData', function () {

  it('should remove the type property', function () {
    _expect.expect(_sanitizeRequestData2['default']({ type: 1 }).type).to.be.undefined;
  });

  it('should remove the links property', function () {
    _expect.expect(_sanitizeRequestData2['default']({ links: 1 }).links).to.be.undefined;
  });

  it('should not remove any other property', function () {
    var data = { a: 1, b: 1, c: 1 };
    _expect.expect(_sanitizeRequestData2['default'](data).a).to.equal(data.a);
    _expect.expect(_sanitizeRequestData2['default'](data).b).to.equal(data.b);
    _expect.expect(_sanitizeRequestData2['default'](data).c).to.equal(data.c);
  });
});