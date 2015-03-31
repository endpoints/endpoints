const path = require('path');
const expect = require('chai').expect;

const requireSearch = require('../../lib/require_search');

describe('requireSearch', () => {
  var searchPaths = [path.join(__dirname, '..', 'fixtures'), path.resolve()];
  var pkg = path.resolve('./package.json');

  it('should throw if no searchPaths are specified', () => {
    expect(() => {
      requireSearch('file');
    }).to.throw(/No searchPaths/);
  });

  it('should require a file, looking in multiple locations to find it', () => {
    expect(requireSearch('package.json', searchPaths)).to.equal(pkg);
  });

  it('should throw if the file cannot be located in any of the search paths', () => {
    expect(() => {
      requireSearch('bad-file', searchPaths);
    }).to.throw(/Unable to locate/);
  });

  it('should throw if the file is located but cannot be required', () => {
    expect(() => {
      requireSearch('invalid', searchPaths);
    }).to.throw(Error);
    expect(() => {
      requireSearch('depends_on_missing', searchPaths);
    }).to.throw(/Cannot find/);
  });

});
