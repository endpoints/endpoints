const expect = require('chai').expect;

const create = require('../../../lib/responders/create');

describe('create', function () {

  it('should return scoped data and code 201 when there are no errors', function () {
    var opts = {
      type: 'type'
    };
    var data = {
      key: 'value'
    };
    var result = create(null, data, opts);
    expect(result.code).to.equal(201);
    expect(result.data[opts.type]).to.equal(data);
  });

  it('should return errors and code 422 when there is an error', function () {
    var errMsg = 'Create error.';
    var data = {
      errors: {
        title: 'Unprocessable Entity',
        detail: errMsg
      }
    };
    var result = create(new Error(errMsg));
    expect(result.code).to.equal(422);
    expect(result.data).to.deep.equal(data);
  });

});
