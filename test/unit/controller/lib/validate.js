import {expect} from 'chai';

import validate from '../../../../src/controller/lib/validate';

describe('validate', () => {
  let config;
  beforeEach(() => {
    config = {
      filter: {},
      include: [],
      store: {
        allRelations: () => ['relation'],
        filters: () => ({
          id: 'a'
        }),
      }
    };
  });

  it('should return an empty array if filters are valid', () => {
    config.filter.id = 1;
    const result = validate('create', config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an empty array if relations are valid', () => {
    config.include = ['relation'];
    const result = validate('create', config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an array with content if passed a bad filter', () => {
    config.filter.badFilter = 1;
    const result = validate('create', config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

  it('should return an array with content if passed a bad relation', () => {
    config.include = ['badRelation'];
    const result = validate('create', config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

});
