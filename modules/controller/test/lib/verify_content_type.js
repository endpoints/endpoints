const expect = require('chai').expect;

const verifyContentType = require('../../lib/verify_content_type');

describe('verifyContentType', function() {

  it('should return an error if no content-type is specified', function() {
    var req = {headers:{}};
    expect(verifyContentType(req)).to.be.instanceof(Error);
  });

  it('should return an error if an incorrect content-type is specified', function() {
    var req = {headers:{'content-type': 'asdf'}};
    expect(verifyContentType(req)).to.be.instanceof(Error);
  });

  it('should not return an error if a conforming content-type is specified', function() {
    var req = {headers:{'content-type': 'application/vnd.api+json'}};
    expect(verifyContentType(req)).to.be.undefined;
  });

});
