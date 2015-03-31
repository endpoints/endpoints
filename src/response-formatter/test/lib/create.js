const expect = require('chai').expect;

const create = require('../../lib/create').bind(null, function (data) {
  return data;
});

describe('create', function () {

  it('should return data and code 201', function () {
    var input = {
      id: '1',
      type: 'test'
    };
    var config = {
      typeName: 'thing'
    };
    var output = create(config, input);
    expect(output.code).to.equal('201');
    expect(output.data).to.deep.equal(input);
    expect(output.headers).to.deep.equal({
      location: '/' + config.typeName + '/' + input.id
    });
  });

});
