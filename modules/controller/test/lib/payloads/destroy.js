const expect = require('chai').expect;

const destroy = require('../../../lib/payloads/destroy');

describe('destroy', function () {

  it('should 204 and no data when there are no errors', function () {
    var type = 'type';
    var data = {
      key: 'value'
    };
    var result = destroy(null, data, { type: type });
    expect(result.code).to.equal('204');
    expect(result.data).to.equal(null);
  });

  it('should return errors and default to code 400 when there is an error', function () {
    var errMsg = 'Destroy error.';
    var data = {
      errors: {
        title: 'Bad Controller Destroy',
        detail: errMsg
      }
    };
    var result = destroy(new Error(errMsg));
    expect(result.code).to.equal('400');
    expect(result.data).to.deep.equal(data);
  });

  it('should return specific status codes when included as an error property', function() {
    var err = new Error('404 Error');
    err.httpStatus = 404;
    var result = destroy(err);
    expect(result.code).to.equal('404');
  });

});
