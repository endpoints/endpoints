import _ from 'lodash';
import {expect} from 'chai';

import Agent from '../../../../../app/agent';
import Fixture from '../../../../../app/fixture';

describe('fetchingData', function() {

  beforeEach(function() {
    return Fixture.reset();
  });

  describe('fetchingResources', function() {

    it('must support fetching resource data for every URL provided as a self link as part of the top-level links object', function() {
      return Agent.request('GET', '/v1/books/1')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');
          console.log(res.body);
          expect(res.body).to.have.any.keys('data', 'errors', 'meta');

          var links = res.body.data.links;
          expect(res.status).to.equal(200);
          return Agent.request('GET', links.self).promise();
        })
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('type');
          expect(res.body.data).to.have.property('attributes');
        });
    });

    it('must support fetching resource data for every URL provided as a self link as part of a resource-level links object');

    it('must support fetching resource data for every URL provided as a related link as part of a relationship-level links object');

    describe('responses', function() {

      describe('200OK', function() {

        it('must respond to a successful request to fetch an individual resource with a `200 OK` response', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {

              // document structure tests
              expect(res.body).to.be.an('object');

              expect(res.status).to.equal(200);
            });
        });

        it('must respond to a successful request to fetch a resource collection with a `200 OK` response', function() {
          return Agent.request('GET', '/v1/books')
            .promise()
            .then(function(res) {

              // document structure tests
              expect(res.body).to.be.an('object');

              expect(res.status).to.equal(200);
            });
        });

        it('must respond to a successful request to fetch that resource with a resource object if an individual resource exists', function() {
          return Agent.request('GET', '/v1/books')
            .promise()
            .then(function(res) {

              // document structure tests
              expect(res.body).to.be.an('object');

              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('data').that.is.a('array');
            });
        });

        it('must respond to a successful request to fetch that resource with `null` provided as primary data for the response document if the requested URL is one that might correspond to a single resource but does not currently', function() {
            return Agent.request('GET', '/v1/books/11/series')
              .promise()
              .then(function(res) {

                // document structure tests
                expect(res.body).to.be.an('object');

                expect(res.status).to.equal(200);
                expect(res.body)
                  .to.have.property('data')
                    .that.is.null;
              });
        });
      });

      describe('404NotFound', function() {

        it('must respond with `404 Not Found` when processing a request to fetch a single resource that does not exist, except when the request warrants a `200 OK` response with `null` as the primary data (as described above).', function() {
          return Agent.request('GET', '/v1/books/9999')
            .promise()
            .then(function(res) {

              // document structure tests
              expect(res.body).to.be.an('object');

              expect(res.status).to.equal(404);
            });
        });

      });

      describe('otherResponses', function() {

        it('may respond with other HTTP status codes');

        it('may include error details with error responses');

        it('must prepare responses, and a client **MUST** interpret responses, in accordance with HTTP semantics');
      });
    });
  });

  describe('fetchingRelationships', function() {

    it('must support fetching relationship data for every relationship URL provided as a self link as part of a relationship\'s links object', function() {
      return Agent.request('GET', '/v1/books/1')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          var relationships = res.body.data.relationships;
          expect(res.status).to.equal(200);
          return Agent.request('GET', relationships.chapters.links.self).promise();
        })
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          expect(res.status).to.equal(200);
          expect(res.body.data.length).to.equal(22);
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0]).to.have.property('type');
          expect(res.body.data[0].attributes).to.have.property('title');
          expect(res.body.data[0].attributes).to.have.property('ordering');
        });
    });

    describe('responses', function() {

      describe('200OK', function() {

        it('must respond to a successful request to fetch a relationship with a `200 OK` response');

        it('The primary data in the response document **MUST** match the appropriate value for resource linkage, as described above for relationship objects');

        it('The top-level links object **MAY** contain self and related links, as described above for relationship objects');
      });

      describe('404NotFound', function() {

        it('must return 404 Not Found when processing a request to fetch a relationship link URL that does not exist.', function() {
          return Agent.request('GET', '/v1/books/1/relationships/bees')
            .promise()
            .then(function(res) {

              // document structure tests
              expect(res.body).to.be.an('object');

              expect(res.status).to.equal(404);
            });
        });

        it('If a relationship link URL exists but the relationship is empty, then `200 OK` **MUST** be returned, as described above');
      });

      describe('otherResponses', function() {

        it('may respond with other HTTP status codes');

        it('may include error details with error responses');

        it('must prepare responses, and a client **MUST** interpret responses, in accordance with HTTP semantics');
      });
    });
  });

  describe.skip('inclusionOfRelatedResources', function() {

    // Endpoints handles this by allowing the API implementer to set
    // default includes in the router. Endpoints will not include
    // included resources by default.
    it('may return resources related to the primary data by default');

    it('may support an `include` request parameter to allow the client to customize which related resources should be returned', function() {
      return Agent.request('GET', '/v1/books/1?include=author')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          var dataObj = res.body.data;
          expect(res.status).to.equal(200);
          var includedAuthorLinkage = dataObj.relationships.author.data;
          expect(res.body.included).to.be.a('array');
          expect(res.body.included[0].type).to.equal(includedAuthorLinkage.type);
          expect(res.body.included[0].id).to.equal(includedAuthorLinkage.id);
        });
    });

    it('must not include unrequested resource objects in the included section of the compound document if it supports the include parameter and a client supplies it', function() {
      return Agent.request('GET', '/v1/books/1?include=series')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          expect(res.status).to.equal(200);
          var includedTypes = _.pluck(res.body.included, 'type');
          expect(includedTypes.indexOf('series')).to.equal(0);
          expect(includedTypes.length).to.equal(1);
        });
    });

    it('must require the value of the `include` parameter be a comma-separated (U+002C COMMA, ",") list of relationship paths. A relationship path is a dot-separated (U+002E FULL-STOP, ".") list of relationship names');

    it('must respond with 400 Bad Request if a server is unable to identify a relationship path or does not support inclusion of resources from a path');
  });

  describe.skip('sparseFieldsets', function() {

    it('may support a `fields[TYPE]` request parameter to allow the client to customize which related resources should be returned');

    it('must require the value of the `fields` parameter to be a comma-separated (U+002C COMMA, ",") list that refers to the name(s) of the fields to be returned');

    it('it must not include additional fields in the response if a client requests a restricted set of fields', function() {
      return Agent.request('GET', '/v1/books/?fields[books]=id,title')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          var dataObj = res.body.data[0];
          expect(dataObj).to.have.property('id');
          expect(dataObj.attributes).to.have.property('title');
          expect(dataObj.attributes).to.not.have.property('date_published');
        });
    });
  });

  describe.skip('sorting', function() {

    it('may support requests to sort resource collections according to one or more criteria ("sort fields")');

    it('may support requests to sort the primary data with a `sort` query parameter', function() {
      return Agent.request('GET', '/v1/books/?sort=+title')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          expect(res.body.data[0].attributes.title).to.equal('Harry Potter and the Chamber of Secrets');
        });
    });

    it('must use `sort` to represent sort fields');

    it('may support multiple sort fields by allowing comma-separated (U+002C COMMA, ",") sort fields and should apply sort fields in the order specified', function() {
      return Agent.request('GET', '/v1/books/?sort=-date_published,title')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          expect(res.body.data[0].attributes.title).to.equal('Harry Potter and the Deathly Hallows');
        });
    });

    it('must default to ascending sort order for each sort field');

    it('must return results in descending order if the field name is prefixed with a minus (U+002D HYPHEN-MINUS, "-")', function() {
      return Agent.request('GET', '/v1/books/?sort=-title')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          expect(res.body.data[0].attributes.title).to.equal('The Two Towers');
        });
    });

    it('must return `400 Bad Request` if the server does not support sorting as specified in the query parameter `sort`');

    it('If sorting is supported by the server and requested by the client via query parameter sort, the server **MUST** return elements of the top-level data array of the response ordered according to the criteria specified');

    it('may apply default sorting rules to top-level data if request parameter `sort` is not specified');
  });

  describe.skip('pagination', function() {

    it('may limit the number of resources returned in a response to a subset ("page") of the whole set available');

    it('may provide links to traverse a paginated data set ("pagination links")');

    it('must place pagination links (if present) in the links object that corresponds to a collection');

    it('must not use the following keys for pagination links:\n\n- `first`: the first page of data\n- `last`: the last page of data\n- `prev`: the previous page of data\n- `next`: the next page of data');

    it('must either omit keys or set a `null` value to indicate that a particular link is unavailable');

    it('must force concepts of order, as expressed in the naming of pagination links, to remain consistent with JSON API\'s sorting rules');

    it('should use the `page` query parameter for pagination operations');
  });

  describe.skip('filtering', function() {

    it('should use the `filter` query parameter for filtering operations', function() {
      return Agent.request('GET', '/v1/books/?filter[date_published]=2000-07-08,1937-09-21')
        .promise()
        .then(function(res) {

          // document structure tests
          expect(res.body).to.be.an('object');

          expect(res.body.data.length).to.equal(2);
          expect(res.body.data[0].id).to.equal('7');
          expect(res.body.data[1].id).to.equal('11');
        });
    });
  });
});

/* OLD READ TESTS

  describe('fetchingData', function() {

    describe('sorting', function() {
      // TODO: Support sorting by nested relations
      // https://github.com/endpoints/endpoints/issues/63
      it.skip('should support sorting by nested relationship attributes', function() {
        return Agent.request('GET', '/v1/books/?sort=+author.name')
          .promise()
          .then(function(res) {
            expect(res.body.data[0].attributes.title).to.equal('Harry Potter and the Philosopher\'s Stone');
          });
      });
    });
  });

*/
