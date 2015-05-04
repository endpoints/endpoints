import {expect} from 'chai';

import verifyFullReplacement from '../../../../src/request-handler/lib/verify_full_replacement';

describe('verifyFullReplacement', function() {

  it('should return an error if linkage is an array in single mode', function() {
    expect(verifyFullReplacement({
      method: 'PATCH',
      body: {
        'data': {
          'type': 'articles',
          'id': '1',
          'title': 'Rails is a Melting Pot',
          'links': {
            'tags': {
              'linkage': [
                { 'type': 'tags', 'id': '2' },
                { 'type': 'tags', 'id': '3' }
              ]
            }
          }
        }
      }
    }, {mode: function() {return 'single';}})).to.be.instanceof(Error);
  });

  it('should not return an error if linkage is a single object in single mode', function() {
    expect(verifyFullReplacement({
      method: 'PATCH',
      body: {
        'data': {
          'type': 'articles',
          'id': '1',
          'title': 'Rails is a Melting Pot',
          'links': {
            'tags': {
              'linkage': { 'type': 'tags', 'id': '2' }
            }
          }
        }
      }
    }, {mode: function() {return 'single';}})).to.not.be.instanceof(Error);
  });

  it('should return an error if any linkage is an array in collection mode', function() {
    expect(verifyFullReplacement({
      method: 'PATCH',
      body: {
        'data': [
        {
          'type': 'articles',
          'id': '1',
          'title': 'Rails is a Melting Pot',
          'links': {
            'tags': {
              'linkage': { 'type': 'tags', 'id': '2' }
            }
          }
        }, {
          'type': 'articles',
          'id': '1',
          'title': 'Rails is a Melting Pot',
          'links': {
            'tags': {
              'linkage': [
                { 'type': 'tags', 'id': '2' },
                { 'type': 'tags', 'id': '3' }
              ]
            }
          }
        }]
      }
    }, {mode: function() {return 'collection';}})).to.be.instanceof(Error);
  });

  it('should not return an error if all linkages in collection mode are single objects', function() {
    expect(verifyFullReplacement({
      method: 'PATCH',
      body: {
        'data': [{
          'type': 'articles',
          'id': '1',
          'title': 'Rails is a Melting Pot',
          'links': {
            'tags': {
              'linkage': { 'type': 'tags', 'id': '2' }
            }
          }
        }, {
          'type': 'articles',
          'id': '1',
          'title': 'Rails is a Melting Pot',
          'links': {
            'tags': {
              'linkage': { 'type': 'tags', 'id': '2' }
            }
          }
        }]
      }
    }, {mode: function() {return 'collection';}})).to.not.be.instanceof(Error);
  });

  it('should return an error if data is an array in relation mode', function () {
    expect(verifyFullReplacement({
      method: 'POST',
      body: {
        'data': [
          { 'type': 'tags', 'id': '2' },
          { 'type': 'tags', 'id': '3' }
        ]
      }
    }, {mode: function() {return 'relation';}})).to.be.instanceof(Error);
  });

  it('should not return an error if data is a single object in relation mode', function () {
    expect(verifyFullReplacement({
      method: 'POST',
      body: {
        'data': { 'type': 'tags', 'id': '2' }
      }
    }, {mode: function() {return 'relation';}})).to.not.be.instanceof(Error);
  });
});
