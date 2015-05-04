import {expect} from 'chai';

import modelHas from '../../../../src/controller/lib/model_has';

describe('modelHas', () => {
  it('should return undefined if there "request" argument', () => {
    expect(modelHas([1], null, 'number')).to.be.undefined;
  });

  it('should return an empty array if the members of the requested array is in the array', () => {
    expect(modelHas([1], [1], 'number')).to.be.an('array');
  });

  it('should return null if the requested item is an existing object property', () => {
    expect(modelHas({'1':'a'}, '1', 'property')).to.be.null;
  });

  it('should return an error message if the requested item is not in the array', () => {
    expect(modelHas([1], [2], 'number')).to.match(/Model does not have/);
    expect(modelHas({'1':'a'}, '2', 'property')).to.match(/Model does not have/);
  });
});
