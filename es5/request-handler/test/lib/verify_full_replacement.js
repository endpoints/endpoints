'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _verifyFullReplacement = require('../../lib/verify_full_replacement');

var _verifyFullReplacement2 = _interopRequireWildcard(_verifyFullReplacement);

describe('verifyFullReplacement', function () {

  it('should return an error if linkage is an array in single mode', function () {
    _expect.expect(_verifyFullReplacement2['default']({
      method: 'PATCH',
      body: {
        data: {
          type: 'articles',
          id: '1',
          title: 'Rails is a Melting Pot',
          links: {
            tags: {
              linkage: [{ type: 'tags', id: '2' }, { type: 'tags', id: '3' }]
            }
          }
        }
      }
    }, { mode: function mode() {
        return 'single';
      } })).to.be['instanceof'](Error);
  });

  it('should not return an error if linkage is a single object in single mode', function () {
    _expect.expect(_verifyFullReplacement2['default']({
      method: 'PATCH',
      body: {
        data: {
          type: 'articles',
          id: '1',
          title: 'Rails is a Melting Pot',
          links: {
            tags: {
              linkage: { type: 'tags', id: '2' }
            }
          }
        }
      }
    }, { mode: function mode() {
        return 'single';
      } })).to.not.be['instanceof'](Error);
  });

  it('should return an error if any linkage is an array in collection mode', function () {
    _expect.expect(_verifyFullReplacement2['default']({
      method: 'PATCH',
      body: {
        data: [{
          type: 'articles',
          id: '1',
          title: 'Rails is a Melting Pot',
          links: {
            tags: {
              linkage: { type: 'tags', id: '2' }
            }
          }
        }, {
          type: 'articles',
          id: '1',
          title: 'Rails is a Melting Pot',
          links: {
            tags: {
              linkage: [{ type: 'tags', id: '2' }, { type: 'tags', id: '3' }]
            }
          }
        }]
      }
    }, { mode: function mode() {
        return 'collection';
      } })).to.be['instanceof'](Error);
  });

  it('should not return an error if all linkages in collection mode are single objects', function () {
    _expect.expect(_verifyFullReplacement2['default']({
      method: 'PATCH',
      body: {
        data: [{
          type: 'articles',
          id: '1',
          title: 'Rails is a Melting Pot',
          links: {
            tags: {
              linkage: { type: 'tags', id: '2' }
            }
          }
        }, {
          type: 'articles',
          id: '1',
          title: 'Rails is a Melting Pot',
          links: {
            tags: {
              linkage: { type: 'tags', id: '2' }
            }
          }
        }]
      }
    }, { mode: function mode() {
        return 'collection';
      } })).to.not.be['instanceof'](Error);
  });

  it('should return an error if data is an array in relation mode', function () {
    _expect.expect(_verifyFullReplacement2['default']({
      method: 'POST',
      body: {
        data: [{ type: 'tags', id: '2' }, { type: 'tags', id: '3' }]
      }
    }, { mode: function mode() {
        return 'relation';
      } })).to.be['instanceof'](Error);
  });

  it('should not return an error if data is a single object in relation mode', function () {
    _expect.expect(_verifyFullReplacement2['default']({
      method: 'POST',
      body: {
        data: { type: 'tags', id: '2' }
      }
    }, { mode: function mode() {
        return 'relation';
      } })).to.not.be['instanceof'](Error);
  });
});