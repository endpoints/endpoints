import {expect} from 'chai';

import Agent from '../../../../../app/agent';
import Fixture from '../../../../../app/fixture';

describe('creatingResources', function() {
  var bookData;

  beforeEach(function() {
    bookData = {
      type: 'books',
      attributes: {
        title: 'The Lost Book of Tolkien',
        date_published: '2015-02-17'
      },
      relationships: {
        author: {data: {type: 'authors', id: '1'}},
        series: {data: {type: 'series', id: '1'}},
        stores: {data: [
          {type: 'stores', id: '1'}
        ]}
      }
    };
    return Fixture.reset();
  });

  // NOTE: JSON-API does not require an error here.
  // See https://github.com/json-api/json-api/issues/766
  it('must require a single resource object as primary data', function() {
    return Agent.request('POST', '/v1/books')
      .send({ data: [bookData] })
      .promise()
      .then(function(res) {

        // document structure tests
        expect(res.body).to.be.an('object');

        expect(res.status).to.equal(400);
      });
  });

  it('The resource object **MUST** contain at least a type member.');

  it('If a relationship is provided in the `relationships` member of the resource object, its value **MUST** be a relationship object with a `data` member.');

  describe('clientGeneratedIds', function() {

    it('may accept a client-generated ID along with a request to create a resource.');

    it('An ID **MUST** be specified with an `id` key, the value of which **MUST** be a universally unique identifier.');

    it('The client **SHOULD** use a properly generated and formatted *UUID* as described in RFC 4122 [RFC4122].');

    it('must return `403 Forbidden` in response to an unsupported request to create a resource with a client-generated ID.');
  });

  describe('responses', function() {

    describe('201Created', function() {

      it('If a `POST` request did not include a Client-Generated ID and the requested resource has been created successfully, the server **MUST** return a `201 Created` status code.');

      it('The response **SHOULD** include a `Location` header identifying the location of the newly created resource.');

      it('The response **MUST** also include a document that contains the primary resource created.');

      it('If the resource object returned by the response contains a `self` key in its `links` member and a `Location` header is provided, the value of the `self` member **MUST** match the value of the `Location` header.');
    });

    describe('202Accepted', function() {

      it('If a request to create a resource has been accepted for processing, but the processing has not been completed by the time the server responds, the server **MUST** return a `202 Accepted` status code.');
    });

    describe('204NoContent', function() {

      it('If a `POST` request did include a Client-Generated ID and the requested resource has been created successfully, the server **MUST** return either a `201 Created` status code and response document (as described above) or a `204 No Content` status code with no response document.');
    });

    describe('403Forbidden', function() {

      it('may return `403 Forbidden` in response to an unsupported request to create a resource.');
    });

    describe('409Conflict', function() {

      it('must return `409 Conflict` when processing a `POST` request to create a resource with a client-generated ID that already exists.', function() {
        bookData.id = 1;
        return Agent.request('POST', '/v1/books')
          .send({ data: bookData })
          .promise()
          .then(function(res) {

            // document structure tests
            expect(res.body).to.be.an('object');

            expect(res.status).to.equal(409);
          });
      });

      it('must return `409 Conflict` when processing a `POST` request in which the resource object\'s type is not among the type(s) that constitute the collection represented by the endpoint.', function() {
        bookData.type = 'authors';
        return Agent.request('POST', '/v1/books')
          .send({ data: bookData })
          .promise()
          .then(function(res) {

            // document structure tests
            expect(res.body).to.be.an('object');

            expect(res.status).to.equal(409);
          });
      });

      it('should include error details and provide enough information to recognize the source of the conflict.');
    });

    describe('OtherResponses', function() {

      it('may respond with other HTTP status codes.');

      it('may include error details with error responses.');

      it('must prepare responses, and a client **MUST** interpret responses, in accordance with HTTP semantics.');
    });
  });
});

/* OLD CREATE TESTS
describe('creatingResources', function() {

  it('must respond to an unsuccessful request with a JSON object containing a collection keyed by "errors" in the top level', function() {
    return Agent.request('POST', '/v1/books')
      .send({})
      .promise()
      .then(function(res) {
        expect(res.status).to.be.within(400, 499); // any error

        // document structure tests
        expect(res.body).to.be.an('object');

        expect(res.body.errors).to.be.an('array');
      });
  });

  it('must require a content-type header of application/vnd.api+json', function() {
    return Agent.request('POST', '/v1/books')
      .type('application/json')
      .send({ data: bookData })
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(415);
      });
  });

  it('must require primary data to have a type member', function() {
    delete bookData.type;
    return Agent.request('POST', '/v1/books')
      .send({ data: bookData })
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(400);
      });
  });

  describe('clientGeneratedIds', function() {
    it('may accept a client-generated ID along with a request to create a resource', function() {
      return Agent.request('POST', '/v1/stores')
        .send({
          data: {
            id: 9999,
            type: 'stores',
            attributes: {
              name: 'user generated id store'
            }
          }
        })
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(201);
        });
    });

    it('must return 403 Forbidden in response to an unsupported request using a client-generated ID', function () {
      bookData.id = 9999;
      return Agent.request('POST', '/v1/books')
        .send({ data: bookData })
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(403);
        });
    });
  });

  describe('responses', function() {

    describe('201Created', function() {
      it('must respond with 201 and include a Location header identifying the location of the new resource', function() {
        return Agent.request('POST', '/v1/books')
          .send({ data: bookData })
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(201);
            var location = res.headers.location;
            var book = res.body.data;
            var expectedLocation = '/v1/books/' + book.id;

            expect(location).to.equal(expectedLocation);
          });
      });

      it('must include a document containing the primary resource created', function() {
        return Agent.request('POST', '/v1/books')
          .send({ data: bookData })
          .promise()
          .then(function(res) {
            var data = res.body.data;
            expect(res.status).to.equal(201);
            expect(data).to.have.property('id');
            expect(data.date_published).to.equal(bookData.date_published);
            expect(data.title).to.equal(bookData.title);
          });
      });

      it('must make the self link and Location header the same', function() {
        return Agent.request('POST', '/v1/books')
          .send({ data: bookData })
          .promise()
          .then(function(res) {
            expect(res.headers.location).to.equal(res.body.data.links.self);
          });
      });

      it('must add all relations', function() {
        return Agent.request('POST', '/v1/books')
          .send({ data: bookData })
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(201);
            var createData = res.body.data;
            expect(createData.id).to.be.a('string');
            return Agent.request('GET', '/v1/books/' + createData.id + '?include=author,series,stores')
              .promise()
              .then(function(res) {
                var readResult = res.body;
                var payloadData = readResult.data;
                var payloadRelationships = payloadData.relationships;
                expect(readResult.included.length).to.equal(3);
                expect(payloadData.attributes.title).to.equal(bookData.attributes.title);
                expect(payloadData.attributes.date_published).to.equal(bookData.attributes.date_published);
                expect(payloadRelationships.author.data.id).to.equal(bookData.relationships.author.data.id);
                expect(payloadRelationships.series.data.id).to.equal(bookData.relationships.series.data.id);
                expect(payloadRelationships.stores.data[0].id).to.equal(bookData.relationships.stores.data[0].id);
              });
          });
      });
    });
  });
});
*/
