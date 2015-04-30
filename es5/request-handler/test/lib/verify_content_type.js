'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _verifyContentType = require('../../lib/verify_content_type');

var _verifyContentType2 = _interopRequireWildcard(_verifyContentType);

describe('verifyContentType', function () {

  it('should return an error if no content-type is specified', function () {
    var req = { headers: {} };
    _expect.expect(_verifyContentType2['default'](req)).to.be['instanceof'](Error);
  });

  it('should return an error if an incorrect content-type is specified', function () {
    var req = { headers: { 'content-type': 'asdf' } };
    _expect.expect(_verifyContentType2['default'](req)).to.be['instanceof'](Error);
  });

  it('should not return an error if a conforming content-type is specified', function () {
    var req = { headers: { 'content-type': 'application/vnd.api+json' } };
    _expect.expect(_verifyContentType2['default'](req)).to.be.undefined;
  });
});