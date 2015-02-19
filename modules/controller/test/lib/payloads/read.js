const expect = require('chai').expect;

const read = require('../../../lib/payloads/read');

describe('read', function () {

  it('should return data and code 200 when there are no errors', function () {
    /* TODO: test json-api serialization using source-memory
    var result = read(null, {});
    expect(result.code).to.equal(200);
    expect(result.data).to.deep.equal({});
    */
  });

  it('should return data and code 404 when no results were found', function () {
    var result = read(null, null);
    expect(result.code).to.equal(404);
    /* TODO: test json-api serialization using source-memory
    expect(result.data).to.deep.equal({
      errors: {
        title: 'Not Found',
        detail: 'Resource not found.'
      }
    });
    */
  });

  it('should return errors and code 400 when there is an error', function () {
    var errMsg = 'Read error.';
    var result = read(new Error(errMsg));
    expect(result.code).to.equal(400);
    /* TODO: test json-api serialization using source-memory
    var data = {
      errors: {
        title: 'Bad Controller Read',
        detail: errMsg
      }
    };
    expect(result.data).to.deep.equal(data);
    */
  });

});
