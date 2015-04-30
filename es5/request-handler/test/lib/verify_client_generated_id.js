'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _verifyClientGeneratedId = require('../../lib/verify_client_generated_id');

var _verifyClientGeneratedId2 = _interopRequireWildcard(_verifyClientGeneratedId);

describe('verifyClientGeneratedId', function () {

  it('should return an error if a single record contains an id', function () {
    _expect.expect(_verifyClientGeneratedId2['default']({
      method: 'POST',
      body: {
        data: {
          id: '1'
        }
      }
    }, {})).to.be['instanceof'](Error);
  });

  it('should return an error if any records in an array contain an id', function () {
    _expect.expect(_verifyClientGeneratedId2['default']({
      method: 'POST',
      body: {
        data: [{ id: '1' }]
      }
    }, {})).to.be['instanceof'](Error);
  });
});