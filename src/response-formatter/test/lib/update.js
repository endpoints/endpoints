const expect = require('chai').expect;

const update = require('../../lib/update').bind(null, function (data) {
  return data;
});

describe('#update', function () {

  it('should return data and code 200', function () {
    var input = {
      data: {
        id: '1',
        type: 'test'
      }
    };
    var opts = {
      typeName: 'thing'
    };
    var output = update(input, opts);
    expect(output.code).to.equal('200');
    expect(output.data).to.deep.equal(input);
  });

});
