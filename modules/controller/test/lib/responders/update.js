const expect = require('chai').expect;

const update = require('../../../lib/responders/update');

describe('update', function () {

  it('should return scoped data and code 200 when there are no errors', function () {
    var opts = {
      type: 'type'
    };
    var data = {
      key: 'value'
    };
    var result = update(null, data, opts);
    expect(result.code).to.equal(200);
    expect(result.data[opts.type]).to.equal(data);
  });

  it('should return errors and code 422 when there is an error', function () {
    var errMsg = 'Update error.';
    var data = {
      errors: {
        title: 'Unprocessable Entity',
        detail: errMsg
      }
    };
    var result = update(new Error(errMsg));
    expect(result.code).to.equal(422);
    expect(result.data).to.deep.equal(data);
  });

});
