'use strict';

var path = require('path');
var expect = require('chai').expect;
var requireSilent = require('../../lib/require_silent');

describe('requireSilent', function () {

  it('should require a file', function () {
    var packagePath = path.resolve('./package');
    expect(requireSilent(packagePath)).to.deep.equal(require(packagePath));
  });

  it('should not throw if file is not found', function () {
    expect(function () {
      requireSilent('path/to/nowhere');
    }).to.not['throw'];
  });

  it('should return error if file is not found', function () {
    expect(requireSilent('path/to/nowhere')).to.be.an['instanceof'](Error);
  });
});