import {expect} from 'chai';

import reader from '../../lib/read';

const read = reader.bind(null, function (data) {
  return data;
});

describe('#read', function () {

  it('should return data and code 200', function () {
    var input = {
      type: 'test'
    };
    var config = {
      typeName: 'thing'
    };
    var output = read(config, input);
    expect(output.code).to.equal('200');
    expect(output.data).to.deep.equal(input);
  });

  it('should return data and code 404', function () {
    var opts = {
      typeName: 'thing'
    };
    var output = read(null, opts);
    expect(output.code).to.equal('404');
    // TOOD: test this
    //expect(output.data).to.equal(null);
  });

});
