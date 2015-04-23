import {expect} from 'chai';

import verifyClientGeneratedId from '../../lib/verify_client_generated_id';

describe('verifyClientGeneratedId', function() {

  it('should return an error if a single record contains an id', function() {
    expect(verifyClientGeneratedId({
      method: 'POST',
      body: {
        data: {
          id: '1'
        }
      }
    }, {})).to.be.instanceof(Error);
  });

  it('should return an error if any records in an array contain an id', function () {
    expect(verifyClientGeneratedId({
      method: 'POST',
      body: {
        data: [
          { id: '1' }
        ]
      }
    }, {})).to.be.instanceof(Error);
  });

});
