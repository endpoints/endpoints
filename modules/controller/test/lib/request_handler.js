const expect = require('chai').expect;

const requestHandler = require('../../lib/request_handler');

describe('requestHandler', function() {
  var opts = {
    method: 'method'
  };

  it('should return a function', function() {
    expect(requestHandler(opts)).to.be.a('function');
  });

});
