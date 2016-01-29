import {expect} from 'chai';

import throwIfNoModel from '../../../../src/request-handler/lib/throw_if_no_model';

describe('throwIfNoModel', () => {
  it('should throw if not passed an argument', () => {
    expect(() => {throwIfNoModel();}).to.throw(/Unable/);
  });

  it('should throw if passed an error', () => {
    expect(() => {throwIfNoModel(new Error());}).to.throw();
    // keep? these rely on internal implementation details
    expect(() => {throwIfNoModel(new Error('No rows were affected'));}).to.throw();
    expect(() => {throwIfNoModel(new Error('Unable to locate model.'));}).to.throw();
  });

  it('should not throw if passed a non-error argument', () => {
    expect(() => {throwIfNoModel({});}).to.not.throw();
  });
});
