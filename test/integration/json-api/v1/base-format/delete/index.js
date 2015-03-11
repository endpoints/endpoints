const expect = require('chai').expect;
const agent = require('../../../../../agent');

const App = require('../../../../../app');
const _ = require('lodash');

describe('deletingResources', function() {

  beforeEach(function() {
    return App.reset();
  });

  it('must not require a content-type header of application/vnd.api+json', function() {
    return agent.request('DELETE', '/chapters/1')
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(204);
      });
  });

  it('must respond to a successful request with an empty body', function() {
    return agent.request('DELETE', '/chapters/1')
      .promise()
      .then(function (res) {
        expect(res.status).to.be.within(200, 299);
        expect(res.body).to.deep.equal({});
      });
  });

  it('must respond to an unsuccessful request with a JSON object', function() {
    return agent.request('DELETE', '/chapters/9999')
      .promise()
      .then(function (res) {
        expect(res.body).to.be.an('object');
      });
  });

  // TODO: Source/DB test: verify rollback on error
  it.skip('must not allow partial updates');

  it('should delete resources when a DELETE request is made to the resource URL', function() {
    var first, second, deleteId;

    return agent.request('GET', '/books')
      .promise()
      .then(function(res) {
        first = res;
        expect(res.body.data).to.be.a('array');
        deleteId = res.body.data[0].id;
        return agent.request('DELETE', '/books/' + deleteId).promise();
      })
      .then(function(res) {
        return agent.request('GET', '/books').promise();
      })
      .then(function(res) {
        second = res;
        expect(second.body.data.length).to.equal(first.body.data.length - 1);
        expect(_.pluck(second.body.data, 'id')).to.not.contain(deleteId);
      });
  });

  describe('responses', function() {

    describe('204NoContent', function() {
      it('must return 204 No Content on a successful DELETE request', function() {
        return agent.request('DELETE', '/chapters/1')
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(204);
          });
      });

      it('must return 204 No Content when processing a request to delete a resource that does not exist', function() {
        return agent.request('DELETE', '/chapters/9999')
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(204);
          });
      });
    });

    // Not testable as written. Each error handling branch should be
    // unit-tested for proper HTTP semantics.

    describe.skip('otherResponses', function() {
      it('should use other HTTP codes to represent errors');
      it('must interpret errors in accordance with HTTP semantics');
      it('should return error details');
    });
  });
});
