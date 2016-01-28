import {expect} from 'chai';

import create from '../../../../src/store-bookshelf/lib/create';
import destroy from '../../../../src/store-bookshelf/lib/destroy';

export default function (Models) {

  describe('create', () => {

    it('should throw an error when no model is passed', () => {

      expect(() => create()).to.throw(/No model provided\./);

    });

    it('should throw a 409 when there is a conflict', (done) => {

      create(Models.Book)
      .catch((err) => {
        expect(err.httpStatus).to.equal(409);
        expect(err.title).to.equal('Conflict');
        done();
      });

    });

    it('should create', (done) => {

      const title = `Book${ Math.random() }`;

      create(Models.Book, {
        attributes: {
          author_id: 99,
          date_published: new Date(),
          title,
        }
      })
      .then((result) => {
        expect(result.get('title')).to.equal(title);
        return destroy(result);
      })
      .then(() => done());

    });

  });

}
