'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _validateJSONSchema = require('../');

var _validateJSONSchema2 = _interopRequireWildcard(_validateJSONSchema);

describe('ValidateJSONSchema', function () {
  var request = {
    headers: {
      accept: 'application/vnd.api+json'
    },
    query: {},
    payload: {},
    body: {},
    auth: {}
  };

  it('should return null when there is no schema on the endpoint', function () {

    var endpoint = {
      schema: null
    };

    var error = _validateJSONSchema2['default'](request, endpoint);
    _expect.expect(error).to.be.undefined;
  });

  it('should return an array of Kapow objects when there is an error', function () {

    var sortFilterRequiredSchema = {
      properties: {
        sort: {
          required: true
        },
        filter: {
          required: true
        }
      }
    };

    var endpoint = {
      schema: {
        query: sortFilterRequiredSchema
      }
    };

    var error = _validateJSONSchema2['default'](request, endpoint);
    _expect.expect(error).to.be['instanceof'](Array);
    _expect.expect(error.length).to.be.equal(2);
    _expect.expect(error[0].message).to.be.ok;
  });

  it('should return an error when the `query` schema does not match the request', function () {

    var sortRequiredSchema = {
      properties: {
        sort: {
          type: 'string',
          required: true
        }
      }
    };

    var endpoint = {
      schema: {
        query: sortRequiredSchema
      }
    };

    var error = _validateJSONSchema2['default'](request, endpoint);
    _expect.expect(error.length).to.equal(1);
    _expect.expect(error[0].message).to.equal('query.sort is required');
  });
});