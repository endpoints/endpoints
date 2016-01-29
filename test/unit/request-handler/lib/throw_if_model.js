import {expect} from 'chai';

import throwIfModel from '../../../../src/request-handler/lib/throw_if_model';

describe('throwIfModel', () => {
  it('should throw if passed an argument', () => {
    expect(() => {throwIfModel({});}).to.throw(/Model/);
  });

  it('should not throw if not passed an argument', () => {
    expect(() => {throwIfModel();}).to.not.throw();
  });
});
