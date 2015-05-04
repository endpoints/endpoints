import {expect} from 'chai';

import throwIfModel from '../../../../src/request-handler/lib/throw_if_model';

describe('throwIfModel', function() {
  it('should throw if passed an argument', function() {
    expect(function() {throwIfModel({});}).to.throw(/Model/);
  });

  it('should not throw if not passed an argument', function() {
    expect(function() {throwIfModel();}).to.not.throw();
  });
});
