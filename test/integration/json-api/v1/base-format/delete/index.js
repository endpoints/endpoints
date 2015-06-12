import {expect} from 'chai';
// import _ from 'lodash';

import Agent from '../../../../../app/agent';
import Fixture from '../../../../../app/fixture';

describe('deletingResources', function() {

  beforeEach(function() {
    return Fixture.reset();
  });

  describe('responses', function() {

    describe('202Accepted', function() {

      it('If a deletion request has been accepted for processing, but the processing has not been completed by the time the server responds, the server **MUST** return a `202 Accepted` status code.');
    });

    describe('204NoContent', function() {

      it('A server **MUST** return a `204 No Content` status code if a deletion request is successful and no content is returned.', function() {
        return Agent.request('DELETE', '/v1/chapters/1')
          .promise()
          .then(function (res) {
            expect(res.status).to.equal(204);
            expect(res.body).to.deep.equal({});
          });
      });
    });

    describe('200OK', function() {

      it('A server **MUST** return a `200 OK` status code if a deletion request is successful and the server responds with only top-level meta data.');
    });

    describe('otherResponses', function() {

      it('A server **MAY** respond with other HTTP status codes.');

      it('A server **MAY** include error details with error responses.');

      it('A server **MUST** prepare responses, and a client **MUST** interpret responses, in accordance with HTTP semantics.');
    });
  });
});

/* OLD DELETE TESTS
describe('deletingResources', function() {

  it('must not require a content-type header of application/vnd.api+json', function() {
    return Agent.request('DELETE', '/v1/chapters/1')
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(204);
      });
  });

  it('must respond to an unsuccessful request with a JSON object', function() {
    return Agent.request('DELETE', '/v1/chapters/9999')
      .promise()
      .then(function (res) {
        expect(res.body).to.be.an('object');
      });
  });

  it('should delete resources when a DELETE request is made to the resource URL', function() {
    var first, second, deleteId;

    return Agent.request('GET', '/v1/chapters')
      .promise()
      .then(function(res) {
        first = res;
        expect(res.body.data).to.be.a('array');
        deleteId = res.body.data[0].id;
        return Agent.request('DELETE', '/v1/chapters/' + deleteId).promise();
      })
      .then(function(res) {
        return Agent.request('GET', '/v1/chapters').promise();
      })
      .then(function(res) {
        second = res;
        expect(second.body.data.length).to.equal(first.body.data.length - 1);
        expect(_.pluck(second.body.data, 'id')).to.not.contain(deleteId);
      });
  });

  describe('responses', function() {
      it('must return 204 No Content when processing a request to delete a resource that does not exist', function() {
        return Agent.request('DELETE', '/v1/chapters/9999')
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(204);
          });
      });
    });
  });
});
*/
