const expect = require('chai').expect;

const sanitizeRequestData = require('../../lib/sanitize_request_data');

describe('sanitizeRequestData', function () {

  it('should remove the type property', function() {
    expect(sanitizeRequestData({type: 1}).type).to.be.undefined;
  });
  it('should remove the links property', function() {
    expect(sanitizeRequestData({links: 1}).links).to.be.undefined;
  });
  it('should not remove any other property', function() {
    var data = {a:1, b:1, c:1};
    expect(sanitizeRequestData(data).a).to.equal(data.a);
    expect(sanitizeRequestData(data).b).to.equal(data.b);
    expect(sanitizeRequestData(data).c).to.equal(data.c);
  });

});
