const expect = require('chai').expect;
const _ = require('lodash');

const Agent = require('../../../../../app/agent');
const Fixture = require('../../../../../app/fixture');

describe('deletingResources', function() {

  beforeEach(function() {
    return Fixture.reset();
  });

  it('must not require a content-type header of application/vnd.api+json', function() {
    return Agent.request('DELETE', '/chapters/1')
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(204);
      });
  });

  it('must respond to a successful request with an empty body', function() {
    return Agent.request('DELETE', '/chapters/1')
      .promise()
      .then(function (res) {
        expect(res.status).to.be.within(200, 299);
        expect(res.body).to.deep.equal({});
      });
  });

  it('must respond to an unsuccessful request with a JSON object', function() {
    return Agent.request('DELETE', '/chapters/9999')
      .promise()
      .then(function (res) {
        expect(res.body).to.be.an('object');
      });
  });

  // TODO: Source/DB test: verify rollback on error
  it('must not allow partial updates');

  it('should delete resources when a DELETE request is made to the resource URL', function() {
    var first, second, deleteId;

    return Agent.request('GET', '/books')
      .promise()
      .then(function(res) {
        first = res;
        expect(res.body.data).to.be.a('array');
        deleteId = res.body.data[0].id;
        return Agent.request('DELETE', '/books/' + deleteId).promise();
      })
      .then(function(res) {
        return Agent.request('GET', '/books').promise();
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
        return Agent.request('DELETE', '/chapters/1')
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(204);
          });
      });

      it('must return 204 No Content when processing a request to delete a resource that does not exist', function() {
        return Agent.request('DELETE', '/chapters/9999')
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(204);
          });
      });
    });

    // Not testable as written. Each error handling branch should be
    // unit-tested for proper HTTP semantics.
    // describe('otherResponses', function() {
    //   it('should use other HTTP codes to represent errors');
    //   it('must interpret errors in accordance with HTTP semantics');
    //   it('should return error details');
    // });
  });
});
