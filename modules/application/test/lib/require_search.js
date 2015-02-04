const path = require('path');

const expect = require('chai').expect;

const requireSearch = require('../../lib/require_search');

describe('requireSearch', function () {
  var searchPaths = [path.resolve('./test'), path.resolve('./')];
  var pkg = path.resolve('./package.json');

  it('should require a file, looking in multiple locations to find it', function () {
    expect(requireSearch('package.json', searchPaths)).to.equal(pkg);
  });

  it('should throw if the file cannot be located in any of the search paths', function () {
    expect(function () {
      requireSearch('bad-file', searchPaths);
    }).to.throw('Unable to locate "bad-file" in search paths: '+searchPaths.join(', '));
  });

});
