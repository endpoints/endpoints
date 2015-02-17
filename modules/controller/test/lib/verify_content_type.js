const expect = require('chai').expect;

const verifyContentType = require('../../lib/verify_content_type');

var req;

describe('verifyContentType', function () {

  beforeEach(function() {
    req = {
      headers: {
        'content-type': 'application/vnd.api+json'
      }
    };
  });

  it('should return true if it has the correct content type', function () {
    expect(verifyContentType(req)).to.be.true;
  });

  it('should return false if the request has the wrong content type', function() {
    req.headers['content-type'] = 'thisIsTheWrongType';
    expect(verifyContentType(req)).to.be.false;
  });

  it('should return false if the content type does not begin with the correct string', function() {
    req.headers['content-type'] = 'somethingElse application/vnd.api+json';
    expect(verifyContentType(req)).to.be.false;
  });

  it('should return true if it starts with the correct type, but adds extensions', function() {
    req.headers['content-type'] = 'application/vnd.api+json; ext=bulk,patch';
    expect(verifyContentType(req)).to.be.true;
  });

});
