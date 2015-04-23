import {expect} from 'chai';

import validateJSONSchema from '../';

describe('ValidateJSONSchema', () => {
  var request = {
    headers: {
      accept: 'application/vnd.api+json'
    },
    query: {},
    payload: {},
    body: {},
    auth: {}
  };


  it('should return null when there is no schema on the endpoint', () => {

    var endpoint = {
      schema: null
    };

    var error = validateJSONSchema(request, endpoint);
    expect(error).to.be.undefined;
  });


  it('should return an array of Kapow objects when there is an error', () => {

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

    var error = validateJSONSchema(request, endpoint);
    expect(error).to.be.instanceof(Array);
    expect(error.length).to.be.equal(2);
    expect(error[0].message).to.be.ok;
  });

  it('should return an error when the `query` schema does not match the request', () => {

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

    var error = validateJSONSchema(request, endpoint);
    expect(error.length).to.equal(1);
    expect(error[0].message).to.equal('query.sort is required');
  });
});
