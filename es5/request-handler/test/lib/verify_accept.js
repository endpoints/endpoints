'use strict';

var expect = require('chai').expect;

var verifyAccept = require('../../lib/verify_accept');

describe('verifyAccept', function () {

  it('should return an error if no accept header is specified', function () {
    var req = { headers: {} };
    expect(verifyAccept(req)).to.be['instanceof'](Error);
  });

  it('should return an error if an incorrect accept header is specified', function () {
    var req = { headers: { accept: 'asdf' } };
    expect(verifyAccept(req)).to.be['instanceof'](Error);
  });

  it('should not return an error if a conforming accept header is specified', function () {
    var req = { headers: { accept: 'application/vnd.api+json' } };
    expect(verifyAccept(req)).to.be.undefined;
  });

  it('should not return an error if it has an accepts header containing "text/html"', function () {
    var req = { headers: { accept: 'text/html' } };
    expect(verifyAccept(req)).to.be.undefined;
  });
});