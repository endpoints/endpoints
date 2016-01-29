import {expect} from 'chai';

import allRelations from '../../../../src/store-bookshelf/lib/all_relations';

describe('allRelations', () => {

  it('should default to an empty array', () => {

    expect(allRelations({})).to.deep.equal([]);

  });

});
