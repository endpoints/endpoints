import {expect} from 'chai';

import createRelation from '../../../../src/store-bookshelf/lib/create_relation';

export default function (Models) {

  describe('createRelation', () => {

    it('should throw an error when no model is passed', () => {

      expect(() => createRelation()).to.throw(/No model provided\./);

    });

  });

}
