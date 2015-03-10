const expect = require('chai').expect;

const configure = require('../../lib/configure');

describe('configure', function() {

  it('should set the method property to opts.method if opts.method exists', function() {
    expect(configure('read', {method:'other'}).method).to.equal('other');
  });

  it('should set the method property to the method argument if opts.method does not exist', function() {
    expect(configure('read').method).to.equal('read');
  });

  it('should set the include property to a array', function() {
    expect(configure('read').include).to.be.an('array');
  });

  it('should set the filter property to an object', function() {
    expect(configure('read').filter).to.be.an('object');
  });

  it('should set the fields property to an object', function() {
    expect(configure('read').filter).to.be.an('object');
  });

  it('should set the sort property to an array', function() {
    expect(configure('read').sort).to.be.an('array');
  });

});
