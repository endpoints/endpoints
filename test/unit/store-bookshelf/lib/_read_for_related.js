import {expect} from 'chai';

import readForRelated from '../../../../src/store-bookshelf/lib/_read_for_related';

export default function (Models) {
  describe('readForRelated', () => {

    it('should return a a model\'s relations (single)', (done) => {
      const mode = 'related';
      readForRelated(mode, Models.Book, 1, 'author', { filter: {} })
      .then((result) => {
        expect(result.length).to.equal(1);
        done();
      })
      .catch(err => console.log(err));
    });

    it('should return a a model\'s relations (mulitple)', (done) => {
      const mode = 'related';
      readForRelated(mode, Models.Author, 1, 'books', { filter: {} })
      .then((result) => {
        expect(result.length).to.equal(4);
        done();
      })
      .catch(err => console.log(err));
    });

    it.skip('should return a a model\'s relations (mulitple - filtered)', (done) => {
      const mode = 'related';
      readForRelated(mode, Models.Author, 1, 'books', { filter: { id: 11 } })
      .then((result) => {
        expect(result.length).to.equal(1);
        done();
      })
      .catch(err => console.log(err));
    });

    it('should throw an error when a relation is not defined', (done) => {
      const mode = 'related';
      readForRelated(mode, Models.Book, 1, 'squirrel', { filter: {} })
      .catch((err) => {
        expect(err.httpStatus).to.equal('404');
        expect(err.message).to.equal('Client Error');
        done();
      });
    });

    it('should throw an error when a base model is not found', (done) => {
      const mode = 'related';
      readForRelated(mode, Models.Book, 9999, 'author', { filter: {} })
      .catch((err) => {
        expect(err.httpStatus).to.equal('404');
        expect(err.message).to.equal('Client Error');
        done();
      });
    });

  });
}
