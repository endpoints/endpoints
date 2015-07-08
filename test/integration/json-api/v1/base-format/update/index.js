import {expect} from 'chai';

import Agent from '../../../../../app/agent';
import Fixture from '../../../../../app/fixture';

var patchData;

beforeEach(function() {
  patchData = {
    data: {
      type: 'books',
      id: '1',
      attributes: {
        title: 'tiddlywinks'
      }
    }
  };
  return Fixture.reset();
});

describe('updatingResources', function() {

  it('The `PATCH` request **MUST** include a single resource object as primary data.');

  it('The resource object **MUST** contain `type` and `id` members.');

  describe('updatingAResourcesAttributes', function() {

    it('Any or all of a resource\'s attributes **MAY** be included in the resource object included in a `PATCH` request.');

    it('If a request does not include all of the attributes for a resource, the server **MUST** interpret the missing attributes as if they were included with their current values. It **MUST NOT** interpret them as `null` values.');
  });

  describe('updatingAResourcesRelationships', function() {

    it('Any or all of a resource\'s relationships **MAY** be included in the resource object included in a `PATCH` request.');

    it('If a request does not include all of the relationships for a resource, the server **MUST** interpret the missing relationships as if they were included with their current values. It **MUST NOT** interpret them as `null` or empty values.');

    it('If a relationship is provided in the relationships member of a resource object in a `PATCH` request, its value **MUST** be a relationship object with a data member.');

    it('may reject an attempt to do a full replacement of a to-many relationship.');

    it('In such a case, the server **MUST** reject the entire update, and return a `403 Forbidden` response.');

    it('If an update request has been accepted for processing, but the processing has not been completed by the time the server responds, the server **MUST** return a `202 Accepted` status code.');
  });

  describe('responses', function() {

    describe('202Accepted', function() {

      it('If a server accepts an update but also changes the resource(s) in ways other than those specified by the request (for example, updating the `updated-at` attribute or a computed `sha`), it **MUST** return a `200 OK` response.');
    });

    describe('200OK', function() {

      it('The response document **MUST** include a representation of the updated resource(s) as if a `GET` request was made to the request URL.');

      it('must return a `200 OK` status code if an update is successful, the client\'s current attributes remain up to date, and the server responds only with top-level meta data.');

      it('In this case the server **MUST NOT** include a representation of the updated resource(s).');
    });

    describe('204NoContent', function() {

      it('If an update is successful and the server doesn\'t update any attributes besides those provided, the server **MUST** return either a `200 OK` status code and response document (as described above) or a `204 No Content` status code with no response document.');
    });

    describe('403Forbidden', function() {

      it('must return `403 Forbidden` in response to an unsupported request to update a resource or relationship.');
    });

    describe('404NotFound', function() {

      it('must return `404 Not Found` when processing a request to modify a resource that does not exist.');

      it('must return `404 Not Found` when processing a request that references a related resource that does not exist.');
    });

    describe('409Conflict', function() {

      it('may return `409 Conflict` when processing a `PATCH` request to update a resource if that update would violate other server-enforced constraints (such as a uniqueness constraint on a property other than `id`).');

      it('must return `409 Conflict` when processing a `PATCH` request in which the resource object\'s `type` and `id` do not match the server\'s endpoint.');

      it('A server **SHOULD** include error details and provide enough information to recognize the source of the conflict.');
    });

    describe('otherResponses', function() {

      it('may respond with other `HTTP` status codes.');

      it('may include error details with error responses.');

      it('must prepare responses, and a client **MUST** interpret responses, in accordance with HTTP semantics.');
    });
  });
});

describe('updatingRelationships', function() {

  describe('updatingToOnRelationships', function() {

    it('must respond to `PATCH` requests to a URL from a to-one relationship link as described below.');

    it('The PATCH request MUST include a top-level member named data containing one of:\\n\\n- a resource identifier object corresponding to the new related resource.\\n- `null`, to remove the relationship.');

    it('If the relationship is updated successfully then the server **MUST** return a successful response.');
  });

  describe('updatingToManyRelationships', function() {

    it('must respond to `PATCH`, `POST`, and `DELETE` requests to a URL from a to-many relationship link as described below.');

    it('For all request types, the body **MUST** contain a `data` member whose value is an empty array or an array of resource identifier objects.');

    it('If a client makes a `PATCH` request to a URL from a to-many relationship link, the server **MUST** either completely replace every member of the relationship, return an appropriate error response if some resources can not be found or accessed, or return a `403 Forbidden` response if complete replacement is not allowed by the server.');

    it('If a client makes a `POST` request to a URL from a relationship link, the server **MUST** add the specified members to the relationship unless they are already present.');

    it('If a given `type` and `id` is already in the relationship, the server **MUST NOT** add it again.');

    it('If a given `type` and `id` is already in the relationship, the server **MUST NOT** add it again.');

    it('If all of the specified resources can be added to, or are already present in, the relationship then the server **MUST** return a successful response.');

    it('If the client makes a `DELETE` request to a URL from a relationship link the server **MUST** delete the specified members from the relationship or return a `403 Forbidden` response.');

    it('If the client makes a `DELETE` request to a URL from a relationship link the server **MUST** delete the specified members from the relationship or return a `403 Forbidden` response.');

    it('If all of the specified resources are able to be removed from, or are already missing from, the relationship then the server **MUST** return a successful response.');
  });

  describe('responses', function() {

    describe('202Accepted', function() {

      it('If a relationship update request has been accepted for processing, but the processing has not been completed by the time the server responds, the server **MUST** return a `202 Accepted` status code.');
    });

    describe('204NoContent', function() {

      it('must return a `204 No Content` status code if an update is successful and the representation of the resource in the request matches the result.');
    });

    describe('200OK', function() {

      it('If a server accepts an update but also changes the targeted relationship(s) in other ways than those specified by the request, it **MUST** return a `200 OK` response.');

      it('The response document **MUST** include a representation of the updated relationship(s).');

      it('must return a `200 OK` status code if an update is successful, the client\'s current data remain up to date, and the server responds only with top-level meta data.');

      it('In this case the server **MUST NOT** include a representation of the updated relationship(s).');
    });

    describe('403Forbidden', function() {

      it('must return `403 Forbidden` in response to an unsupported request to update a relationship.');
    });

    describe('otherResponses', function() {

      it('may respond with other HTTP status codes.');

      it('may include error details with error responses.');

      it('must prepare responses, and a client **MUST** interpret responses, in accordance with HTTP semantics.');
    });
  });
});


/* OLD UPDATE TESTS
describe('updatingResources', function() {

  it('must respond to a successful request with an object', function() {
    return Agent.request('PATCH', '/v1/books/1')
      .send(patchData)
      .promise()
      .then(function(res) {
        expect(res.status).to.be.within(200, 299);
        expect(res.body).to.be.an('object');
      });
  });

  it('must respond to an unsuccessful request with a JSON object', function() {
    patchData.data.id = 'asdf';
    return Agent.request('PATCH', '/v1/books/1')
      .send(patchData)
      .promise()
      .then(function(res) {
        expect(res.status).to.be.within(400, 499);
        expect(res.body).to.be.an('object');
        expect(res.body.errors).to.be.an('array');
      });
  });

  // need to implement update / updateRelationship etc
  it.skip('must require a single resource object as primary data', function() {
    patchData.data = [patchData.data];
    return Agent.request('PATCH', '/v1/books/1')
      .send(patchData)
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(400);
      });
  });

  it('must require primary data to have a type member', function() {
    delete patchData.data.type;
    return Agent.request('PATCH', '/v1/books/1')
      .send(patchData)
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(400);
      });
  });

  it('must require a content-type header of application/vnd.api+json', function() {
    return Agent.request('PATCH', '/v1/books/1')
      .type('json')
      .send(patchData)
      .promise()
      .then(function(res) {
        expect(res.status).to.equal(415);
      });
  });

  // TODO: Source/DB test: verify rollback on error
  it('must not allow partial updates');

  describe('updatingResourceAttributes', function() {
    it('should allow only some attributes to be included in the resource object', function() {
      return Agent.request('PATCH', '/v1/books/1')
        .send(patchData)
        .promise()
        .then(function(res) {
          expect(res.status).to.be.within(200, 299);
          expect(res.body).to.be.a('object');
        });
    });

    it('should allow all attributes to be included in the resource object', function() {
      patchData.data = {
        id: '1',
        type: 'books',
        attributes: {
          date_published: '2014-02-25',
          title: 'tiddlywinks'
        },
        relationships: {
          stores: {data: [
            {type: 'stores', id: '1'},
            {type: 'stores', id: '2'}
          ]}
        }
      };
      var firstRead;
      return Agent.request('GET', '/v1/books/1?include=stores').promise()
        .then(function(res) {
          firstRead = res.body;

          return Agent.request('PATCH', '/v1/books/1')
            .send(patchData)
            .promise();
        })
        .then(function(res) {
          expect(res.status).to.be.within(200, 299);
          expect(res.body).to.be.a('object');
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var secondRead = res.body;
          var payloadData = secondRead.data;
          var payloadRelationships = payloadData.relationships;
          var updateRelationships = patchData.data.relationships;

          expect(secondRead.included.length).to.equal(2);
          expect(payloadData.attributes.title).to.equal(patchData.data.attributes.title);
          expect(payloadData.attributes.date_published).to.equal(patchData.data.attributes.date_published);
          expect(payloadRelationships.stores.data[0].id).to.equal(updateRelationships.stores.data[0].id);
          expect(payloadRelationships.stores.data[1].id).to.equal(updateRelationships.stores.data[1].id);

        });
    });

    it('must interpret missing fields as their current values', function() {
      var firstRead;
      return Agent.request('GET', '/v1/books/1?include=stores').promise()
        .then(function(res) {
          firstRead = res.body;
          return Agent.request('PATCH', '/v1/books/1')
            .send(patchData)
            .promise();
        })
        .then(function(res) {
          expect(res.status).to.be.within(200, 299);
          expect(res.body).to.be.a('object');
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var secondRead = res.body;
          expect(secondRead.included).to.deep.equal(firstRead.included);
          expect(secondRead.data.attributes.title).to.not.equal(firstRead.data.attributes.title);
          expect(secondRead.data.attributes.date_published).to.equal(firstRead.data.attributes.date_published);
          expect(secondRead.data.links).to.deep.equal(firstRead.data.links);
        });
    });
  });

  describe('updatingResourceRelationships', function() {
    it('must update to-One relationship with relationship member', function() {
      patchData.data.relationships = {
        author: {data: {type: 'authors', id: '2'}},
        series: {data: {type: 'series', id: '2'}}
      };
      return Agent.request('PATCH', '/v1/books/1')
        .send(patchData)
        .promise()
        .then(function(res) {
          expect(res.status).to.be.within(200, 299);
          expect(res.body).to.be.a('object');
          return Agent.request('GET', '/v1/books/1?include=author,series').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          var updateRelationshps = patchData.data.relationships;
          expect(payloadRelationships.author.data.id).to.equal(updateRelationshps.author.data.id);
          expect(payloadRelationships.series.data.id).to.equal(updateRelationshps.series.data.id);
        });
    });

    it('must attempt to remove to-One relationship with null', function() {
      patchData.data.relationships = { series: {data: null }};
      return Agent.request('PATCH', '/v1/books/1')
        .send(patchData)
        .promise()
        .then(function(res) {
          expect(res.status).to.be.within(200, 299);
          expect(res.body).to.be.a('object');
          return Agent.request('GET', '/v1/books/1?include=series').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(payloadRelationships.series.data).to.equal(null);
        });
    });
  });

  // A server MAY reject an attempt to do a full replacement of a to-many relationship. In such a case, the server MUST reject the entire update, and return a 403 Forbidden response.
  // Note: Since full replacement may be a very dangerous operation, a server may choose to disallow it. A server may reject full replacement if it has not provided the client with the full list of associated objects, and does not want to allow deletion of records the client has not seen.
  describe('updatingResourceToManyRelationships', function() {
    it('must update homogeneous to-Many relationship with an object with type and id members under relationships', function() {
      patchData.data.relationships = {
        stores: { data: [
          { type: 'stores', id: '1' },
          { type: 'stores', id: '2' }
        ]}
      };

      return Agent.request('PATCH', '/v1/books/1')
        .send(patchData)
        .promise()
        .then(function(res) {
          expect(res.status).to.be.within(200, 299);
          expect(res.body).to.be.a('object');
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          var updateRelationships = patchData.data.relationships;
          expect(res.body.included.length).to.equal(2);
          expect(payloadRelationships.stores.data[0].id).to.equal(updateRelationships.stores.data[0].id);
          expect(payloadRelationships.stores.data[1].id).to.equal(updateRelationships.stores.data[1].id);
        });
    });

    it('must attempt to remove to-Many relationships with the id member of the data object set to []', function() {
      patchData.data.relationships = {
        stores: {data: []},
      };

      return Agent.request('PATCH', '/v1/books/1')
        .send(patchData)
        .promise()
        .then(function(res) {
          expect(res.status).to.be.within(200, 299);
          expect(res.body).to.be.a('object');
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(payloadRelationships.stores.data).to.deep.equal([]);
        });
    });

    // Endpoints does not support heterogenous to-Many relationships
    // it('must require heterogeneous to-Many relationship links to be an object with a data member containing an array of objects with type and id members');
  });

  describe('responses', function() {

    describe('204NoContent', function() {
      it('must return 204 No Content on a successful update when attributes remain up-to-date', function() {
        return Agent.request('PATCH', '/v1/stores/1')
          .send({
            data: {
              type: 'stores',
              id: '1',
              attributes: {
                name: 'empty store'
              }
            }
          })
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(204);
          });
      });
    });

    describe('200Ok', function() {

      it('must return 200 OK if it accepts the update but changes the resource in some way', function() {
        return Agent.request('PATCH', '/v1/books/1')
          .send(patchData)
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(200);
            // must include a representation of the updated resource on a 200 OK response
            expect(res.body.data.attributes.title).to.equal(patchData.data.attributes.title);
          });
      });
    });

    // API decision to not create the route - endpoints will always support updating
    // describe('403Forbidden', function() {
    //   it('must return 403 Forbidden on an unsupported request to update a resource or relationship');
    // });

    describe('404NotFound', function() {
      it('must return 404 Not Found when processing a request to modify a resource that does not exist', function() {
        patchData.data.id = '9999';
        return Agent.request('PATCH', '/v1/books/9999')
          .send(patchData)
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(404);
          });
      });

      it('must return 404 Not Found when processing a request that references a to-One related resource that does not exist', function() {
        patchData.data.relationships = {
          author: {data: {type: 'authors', id: '9999'}}
        };
        return Agent.request('PATCH', '/v1/books/1')
          .send(patchData)
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(404);
          });
      });

      it('must return 404 Not Found when processing a request that references a to-Many related resource that does not exist', function() {
        patchData.data.relationships = {
          stores: {data: [{type: 'stores', id: '9999'}]}
        };
        return Agent.request('PATCH', '/v1/books/1')
          .send(patchData)
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(404);
          });
      });
    });

    describe('409Conflict', function() {
      it('should return 409 Conflict when processing an update that violates server-enforced constraints', function() {
        patchData.data.relationships = {
          author: {data: null}
        };
        return Agent.request('PATCH', '/v1/books/1')
          .send(patchData)
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(409);
          });
      });

      // FIXME: Re-implement test
      it.skip('must return 409 Conflict when processing a request where the id does not match the endpoint', function() {
        return Agent.request('PATCH', '/v1/books/2')
          .send(patchData)
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(409);
          });
      });

      // FIXME: Re-implement test
      // see request-handler/lib/verify_data_object
      it.skip('must return 409 Conflict when processing a request where the type does not match the endpoint', function() {
        return Agent.request('PATCH', '/v1/authors/1')
          .send(patchData)
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(409);
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

describe('updatingRelationships', function() {

  describe('updatingToOneRelationships', function() {
    // /books/1/author
    it('must update relationships with a PATCH request to a to-one `relationship` URL containing a data object with type and id members and return 204 No Content on success', function() {
      return Agent.request('PATCH', '/v1/books/1/relationships/author')
        .send({ data: { type: 'authors', id: '2' }})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=author').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(payloadRelationships.author.data.id).to.equal('2');
        });
    });

    it('must remove relationships with a PATCH request to a to-one relationship URL containing a data object with a null value and return 204 No Content on success', function() {
      return Agent.request('PATCH', '/v1/books/1/relationships/series')
        .send({ data: null })
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=series').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(payloadRelationships.series.data).to.equal(null);
        });
    });

    it('must require a top-level data member containing either an object with type and id members or null', function() {
      return Agent.request('PATCH', '/v1/books/1/relationships/series')
        .send({ data: { what: 'a bad request'}})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(400);
        });
    });
  });

  describe('updatingToManyRelationships', function() {
    it('must require a top-level data member an array of linkage objects for PATCH requests', function() {
      return Agent.request('PATCH', '/v1/books/1/relationships/stores')
        .send({ data: [
          { what: 'a bad request' }
        ]})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(400);
        });
    });

    // /books/1/relationships/stores
    it('must update relationships with a PATCH request to a to-many relationship URL containing a data object with type and id members  and return 204 No Content on success', function() {
      return Agent.request('PATCH', '/v1/books/1/relationships/stores')
        .send({ data: [
          { type: 'stores', id: '1' },
          { type: 'stores', id: '2' }
        ]})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(res.body).to.have.property('included');
          expect(payloadRelationships.stores.data[0].id).to.equal('1');
          expect(payloadRelationships.stores.data[1].id).to.equal('2');
        });
    });

    it('must remove relationships with a PATCH request to a to-many relationship URL containing a data object with a null value and return 204 No Content on success', function() {
      var newIds = [];
      return Agent.request('PATCH', '/v1/books/1/relationships/stores')
        .send({ data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(payloadRelationships.stores.data).to.deep.equal(newIds);
        });
    });

    it('must completely replace every member of the relationship on a PATCH request if allowed', function() {
      var newIds = [
        { type: 'stores', id: '1' }
      ];
      return Agent.request('PATCH', '/v1/books/1/relationships/stores')
        .send({ data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(res.body).to.have.property('included');
          expect(payloadRelationships.stores.data.length).to.equal(1);
          expect(payloadRelationships.stores.data[0].id).to.equal('1');
        });
    });

    it('must return an appropriate error if some resources cannot be found or accessed', function() {
      var newIds = [
        { type: 'stores', id: '3' }
      ];
      return Agent.request('PATCH', '/v1/books/1/relationships/stores')
        .send({ data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(404);
        });
    });

    it('must return a 403 Forbidden if complete replacement is not allowed by the server', function() {
      var newIds = [
        { type: 'books', id: '1' }
      ];
      return Agent.request('PATCH', '/v1/stores/2/relationships/books')
        .send({ data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(403);
        });
    });

    it('must require a top-level data member an array of linkage objects for POST requests', function() {
      return Agent.request('POST', '/v1/books/1/relationships/stores')
        .send({ data: [
          { what: 'a bad request' }
        ]})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(400);
        });
    });

    it('must append specified members of a POST request and return 204 No Content if the resource is successfully added or already present', function() {
      var newIds = [
        { type: 'stores', id: '1' }
      ];
      return Agent.request('POST', '/v1/books/1/relationships/stores')
        .send({ data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(res.body).to.have.property('included');
          expect(payloadRelationships.stores.data.length).to.equal(2);
          expect(payloadRelationships.stores.data[0].id).to.equal('1');
          expect(payloadRelationships.stores.data[1].id).to.equal('2');
        });
    });

    it('must not add existing type and id combinations again in a POST request, but still respond with 204 No Content', function() {
      var newIds = [
        { type: 'stores', id: '2' }
      ];
      return Agent.request('POST', '/v1/books/1/relationships/stores')
        .send({ data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(res.body).to.have.property('included');
          expect(payloadRelationships.stores.data.length).to.equal(1);
          expect(payloadRelationships.stores.data[0].id).to.equal('2');
        });
    });

    it('must require a top-level data member an array of linkage objects for DELETE requests', function() {
      return Agent.request('DELETE', '/v1/books/1/relationships/stores')
        .send({ data: [
          { what: 'a bad request' }
        ]})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(400);
        });
    });

    it('must respond 204 No Content to a DELETE request if the relationship is successfully deleted', function() {
      var newIds = [
        { type: 'stores', id: '2' }
      ];
      return Agent.request('DELETE', '/v1/books/1/relationships/stores')
        .send({data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(payloadRelationships.stores.data).to.deep.equal([]);
        });
    });

    it('must respond 204 No Content to a DELETE request if the relationship is already missing', function() {
      var newIds = [
        { type: 'stores', id: '1' }
      ];
      return Agent.request('DELETE', '/v1/books/1/relationships/stores')
        .send({ data: newIds})
        .promise()
        .then(function(res) {
          expect(res.status).to.equal(204);
          return Agent.request('GET', '/v1/books/1?include=stores').promise();
        })
        .then(function(res) {
          var payloadRelationships = res.body.data.relationships;
          expect(res.body).to.have.property('included');
          expect(payloadRelationships.stores.data.length).to.equal(1);
          expect(payloadRelationships.stores.data[0].id).to.equal('2');
        });
    });

    // API decision to not create the route - endpoints will always support deleting relationships
    // it('must respond 403 Forbidden to a DELETE request if the method is unsupported');
  });

  describe('responses', function() {

    // Tested above
    // describe('204NoContent', function() {
    //   it('must return 204 No Content if the update is successful and the attributes remain up to date');
    // });

    // API decision to not create the route - endpoints will always support updating
    // describe('403Forbidden', function() {
    //   it('must return 403 Forbidden in response to an unsupported request to update a relationship');
    // });

    // Not testable as written. Each error handling branch should be
    // unit-tested for proper HTTP semantics.
    // describe('otherResponses', function() {
    //   it('should use other HTTP codes to represent errors');
    //   it('must interpret errors in accordance with HTTP semantics');
    //   it('should return error details');
    // });
  });
});
*/
