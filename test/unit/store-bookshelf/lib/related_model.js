import {expect} from 'chai';
import sinon from 'sinon';

import relatedModel from '../../../../src/store-bookshelf/lib/related_model';

describe('relatedModel', () => {

  it('should get the correct target', () => {
    const model = {
      forge: sinon.stub().returns({
        related: sinon.stub().returns({
          relatedData: {
            target: true,
          }
        })
      })
    };
    const value = relatedModel(model, 'whatever');

    expect(value).to.be.true;
  });

});
