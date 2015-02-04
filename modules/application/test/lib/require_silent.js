const expect = require('chai').expect;
const path = require('path');

const requireSilent = require('../../lib/require_silent');

describe('requireSilent', function () {

  it('should require a file', function () {
    var packagePath = path.resolve('./package');
    expect(requireSilent(packagePath)).to.deep.equal(require(packagePath));
  });

  it('should not throw if file is not found', function () {
    expect(requireSilent('path/to/nowhere')).to.not.throw;
  });

});
