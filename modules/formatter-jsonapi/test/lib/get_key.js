const expect = require('chai').expect;

const getKey = require('../../lib/get_key');

describe('getKey', function () {

  var obj = {
    exists: ['foo', 'bar', 'baz']
  };

  it('should return the existing key on the object if there is one', function () {
    expect(getKey(obj, 'exists')).to.deep.equal(obj.exists);
  });

});
