const path = require('path');

const expect = require('chai').expect;

const requireSearch = require('../../lib/require_search');

describe('requireSearch', function () {
  var searchPaths = [path.join(__dirname, '..', 'fixtures'), path.resolve()];
  var pkg = path.resolve('./package.json');

  it('should throw if no searchPaths are specified', function () {
    expect(function () {
      requireSearch('file');
    }).to.throw;
  });

  it('should require a file, looking in multiple locations to find it', function () {
    expect(requireSearch('package.json', searchPaths)).to.equal(pkg);
  });

  it('should throw if the file cannot be located in any of the search paths', function () {
    expect(function () {
      requireSearch('bad-file', searchPaths);
    }).to.throw(/Unable to locate/);
  });

  it('should throw if the file is located but cannot be required', function () {
    expect(function () {
      requireSearch('invalid', searchPaths);
    }).to.throw(Error);
    expect(function () {
      requireSearch('depends_on_missing', searchPaths);
    }).to.throw(/Cannot find/);
  });

});
