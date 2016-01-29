import {expect} from 'chai';

import verifyFullReplacement from '../../../../src/request-handler/lib/verify_full_replacement';

describe('verifyFullReplacement', () => {

  it('should return an error if linkage is an array in single mode', () => {
    expect(verifyFullReplacement({
      method: 'PATCH',
      params: {
        relation: false,
      },
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
    })).to.be.instanceof(Error);
  });

  it('should not return an error if linkage is a single object in single mode', () => {
    expect(verifyFullReplacement({
      method: 'PATCH',
      params: {
        relation: true,
      },
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
    })).to.not.be.instanceof(Error);
  });

  it('should return an error if any linkage is an array in collection mode', () => {
    expect(verifyFullReplacement({
      method: 'PATCH',
      params: {
        relation: true,
      },
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
    })).to.be.instanceof(Error);
  });

  it('should not return an error if all linkages in collection mode are single objects', () => {
    expect(verifyFullReplacement({
      method: 'PATCH',
      params: {
        relation: false,
      },
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
    })).to.not.be.instanceof(Error);
  });

  it('should return an error if data is an array in relation mode', () => {
    expect(verifyFullReplacement({
      method: 'POST',
      params: {
        relation: true,
      },
      body: {
        'data': [
          { 'type': 'tags', 'id': '2' },
          { 'type': 'tags', 'id': '3' }
        ]
      }
    })).to.be.instanceof(Error);
  });

  it('should not return an error if data is a single object in relation mode', () => {
    expect(verifyFullReplacement({
      method: 'POST',
      params: {
        relation: true,
      },
      body: {
        'data': { 'type': 'tags', 'id': '2' }
      }
    })).to.not.be.instanceof(Error);
  });
});
