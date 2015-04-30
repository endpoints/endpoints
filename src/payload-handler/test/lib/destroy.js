import {expect} from 'chai';

import destroyer from '../../lib/destroy';

const destroy = destroyer.bind(null, function (data) {
  return data;
});

describe('#destroy', function () {

  it('should return data and code 204', function () {
    var output = destroy({});
    expect(output.code).to.equal('204');
    expect(output.data).to.equal(null);
  });

});
