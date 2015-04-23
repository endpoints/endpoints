'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _verifyAccept = require('../../lib/verify_accept');

var _verifyAccept2 = _interopRequireWildcard(_verifyAccept);

describe('verifyAccept', function () {

  it('should return an error if no accept header is specified', function () {
    var req = { headers: {} };
    _expect.expect(_verifyAccept2['default'](req)).to.be['instanceof'](Error);
  });

  it('should return an error if an incorrect accept header is specified', function () {
    var req = { headers: { accept: 'asdf' } };
    _expect.expect(_verifyAccept2['default'](req)).to.be['instanceof'](Error);
  });

  it('should not return an error if a conforming accept header is specified', function () {
    var req = { headers: { accept: 'application/vnd.api+json' } };
    _expect.expect(_verifyAccept2['default'](req)).to.be.undefined;
  });

  it('should not return an error if it has an accepts header containing "text/html"', function () {
    var req = { headers: { accept: 'text/html' } };
    _expect.expect(_verifyAccept2['default'](req)).to.be.undefined;
  });
});