import {expect} from 'chai';
import sinon from 'sinon';

import prop from '../../../../src/store-bookshelf/lib/prop';

describe('prop', () => {

  it('should call get', () => {
    const model = {
      get: sinon.spy()
    };
    prop(model, 'whatever');

    expect(model.get.calledOnce).to.be.true;
  });

});
