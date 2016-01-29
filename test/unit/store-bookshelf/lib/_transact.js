import {expect} from 'chai';

import transact from '../../../../src/store-bookshelf/lib/_transact';

describe('transact', () => {

  it('should call transaction', (done) => {

    let called = false;
    const model = {
      transaction() {
        called = true;
        return Promise.resolve();
      }
    };

    transact(model)
    .then(() => {
      expect(called).to.be.true;
      done();
    });

  });

  it('should throw an error if transaction is not accessible', () => {

    expect(() => transact({})).to.throw(/Please assign Bookshelf\.transaction\.bind\(Bookshelf\)/);

  });

  it('should throw a 404 error if the fk constraint fails', (done) => {

    const model = {
      transaction() {
        return Promise.reject(new Error('foreign key constraint'));
      }
    };

    transact(model)
    .catch((err) => {
      expect(err.httpStatus).to.equal(404);
      expect(err.title).to.equal('Not Found');
      done();
    });

  });

  it('should throw a 409 error if a constraint fails', (done) => {

    const model = {
      transaction() {
        return Promise.reject(new Error('constraint'));
      }
    };

    transact(model)
    .catch((err) => {
      expect(err.httpStatus).to.equal(409);
      expect(err.title).to.equal('Conflict');
      done();
    });

  });

});
