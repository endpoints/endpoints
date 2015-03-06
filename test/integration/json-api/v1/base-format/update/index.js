const expect = require('chai').expect;
const _ = require('lodash');

const DB = require('../../../../../fixtures/classes/database');
const bookController = require('../../../../../fixtures/controllers/books');
const storeController = require('../../../../../fixtures/controllers/stores');

var req = require('../../../../../fixtures/mocks/express_request');

var updateReq;

describe('updatingResources', function() {

  beforeEach(function() {
    updateReq = req({
      params: {
        id: 1
      },
      body: {
        data: {
          type: 'books',
          id: 1,
          title: 'tiddlywinks'
        }
      }
    });
    return DB.reset();
  });

  it('must require an ACCEPT header specifying the JSON API media type', function(done) {
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal('406');
        done();
      }
    });
    updateReq.headers = { accept: '' };
    bookRouteHandler(updateReq);
  });

  it('must respond to a successful request with an object', function(done) {
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.be.within(200, 299);
        expect(payload.data).to.be.an('object');
        done();
      }
    });
    bookRouteHandler(updateReq);
  });

  it('must respond to an unsuccessful request with a JSON object', function(done) {
    updateReq.body.data.id = 'asdf';
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.be.within(400, 499);
        expect(payload.data).to.be.an('object');
        expect(payload.data.errors).to.be.an('array');
        done();
      }
    });
    bookRouteHandler(updateReq);
  });

  it('must not include any top-level members other than "data," "meta," "links," or "included"', function(done) {
    var allowedTopLevel = ['data', 'included', 'links', 'meta'];
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal('200');
        Object.keys(payload.data).forEach(function(key) {
          expect(allowedTopLevel).to.contain(key);
        });
        done();
      }
    });
    bookRouteHandler(updateReq);
  });

  it('must require a single resource object as primary data', function(done) {
    updateReq.body.data = [updateReq.body.data];
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal('400');
        done();
      }
    });
    bookRouteHandler(updateReq);
  });

  it('must require primary data to have a type member', function(done) {
    delete updateReq.body.data.type;
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal('400');
        done();
      }
    });
    bookRouteHandler(updateReq);
  });

  it('must require a content-type header of application/vnd.api+json', function(done) {
    updateReq.headers['content-type'] = '';
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal('415');
        done();
      }
    });
    bookRouteHandler(updateReq);
  });

  // TODO: Source/DB test: verify rollback on error
  // it('must not allow partial updates');

  describe('updatingResourceAttributes', function() {
    it('should allow only some attributes to be included in the resource object', function(done) {
      var bookRouteHandler = bookController.update({
        responder: function(payload) {
          expect(payload.code).to.equal('200');
          expect(payload.data).to.be.an('object');
          done();
        }
      });
      bookRouteHandler(updateReq);
    });

    it('should allow all attributes to be included in the resource object', function(done) {
      var readReq = {
        params: {
          id: 1
        },
        headers: {
          'accept': 'application/vnd.api+json'
        },
        query: {
          include: 'stores'
        }
      };
      var updateData = {
        id: 1,
        date_published: '2014-02-25',
        type: 'books',
        title: 'tiddlywinks',
        links: {
          stores: {type: 'stores', id: ['1', '2']}
        }
      };

      updateReq.body.data = updateData;

      var bookRouteHandler = bookController.update({
        responder: function(payload) {
          expect(payload.code).to.equal('200');
          expect(payload.data).to.be.an('object');

          bookController.read({
            responder: function(payload) {
              var secondRead = payload.data;
              var payloadData = secondRead.data[0];
              var payloadLinks = payloadData.links;
              var updateLinks = updateData.links;

              expect(secondRead.included.length).to.equal(2);
              expect(payloadData.title).to.equal(updateData.title);
              expect(payloadData.date_published).to.equal(updateData.date_published);
              expect(payloadLinks.stores.id).to.deep.equal(updateLinks.stores.id);
              done();
            }
          })(readReq);
        }
      });
      bookRouteHandler(_.cloneDeep(updateReq));
    });

    it('must interpret missing fields as their current values', function(done) {
      var firstRead;
      var readReq = {
        params: {
          id: 1
        },
        headers: {
          'accept': 'application/vnd.api+json'
        },
        query: {
          include: 'stores'
        }
      };
      var bookRouteHandler = bookController.update({
        responder: function(payload) {

          bookController.read({
            responder: function(payload) {
              var secondRead = payload.data;
              var secondReadData = secondRead.data[0];
              var firstReadData = firstRead.data[0];
              expect(secondRead.included).to.deep.equal(firstRead.included);
              expect(secondReadData.title).to.not.equal(firstReadData.title);
              expect(secondReadData.date_published).to.equal(firstReadData.date_published);
              expect(secondReadData.links).to.deep.equal(firstReadData.links);
              done();
            }
          })(readReq);
        }
      });

      bookController.read({
        responder: function(payload) {
          firstRead = payload.data;
          bookRouteHandler(updateReq);
        }
      })(readReq);
    });
  });

  describe('updatingResourceToOneRelationships', function() {
    it('must update to-One relationship with an object with type and id under links', function(done) {
      var readReq = {
        params: {
          id: 1
        },
        headers: {
          'accept': 'application/vnd.api+json'
        }
      };
      var updateData = {
        id: 1,
        type: 'books',
        links: {
          author: {type: 'authors', id: '2'},
          series: {type: 'series', id: '2'}
        }
      };

      updateReq.body.data = updateData;

      var bookRouteHandler = bookController.update({
        responder: function(payload) {
          expect(payload.code).to.equal('200');
          expect(payload.data).to.be.an('object');

          bookController.read({
            responder: function(payload) {
              var payloadLinks = payload.data.data[0].links;
              var updateLinks = updateData.links;
              expect(payloadLinks.author.id).to.equal(updateLinks.author.id);
              expect(payloadLinks.series.id).to.equal(updateLinks.series.id);
              done();
            }
          })(readReq);
        }
      });
      bookRouteHandler(_.cloneDeep(updateReq));
    });

    it('must attempt to remove to-One relationship with null', function(done) {
      var readReq = {
        params: {
          id: 1
        },
        headers: {
          'accept': 'application/vnd.api+json'
        }
      };
      var updateData = {
        id: 1,
        type: 'books',
        links: {
          series: null
        }
      };

      updateReq.body.data = updateData;

      var bookRouteHandler = bookController.update({
        responder: function(payload) {
          expect(payload.code).to.equal('200');
          expect(payload.data).to.be.an('object');

          bookController.read({
            responder: function(payload) {
              var payloadLinks = payload.data.data[0].links;
              // var updateLinks = updateData.links;
              expect(payloadLinks.series.id).to.equal('null');
              done();
            }
          })(readReq);
        }
      });
      bookRouteHandler(_.cloneDeep(updateReq));
    });
  });

  // A server MAY reject an attempt to do a full replacement of a to-many relationship. In such a case, the server MUST reject the entire update, and return a 403 Forbidden response.
  // Note: Since full replacement may be a very dangerous operation, a server may choose to disallow it. A server may reject full replacement if it has not provided the client with the full list of associated objects, and does not want to allow deletion of records the client has not seen.
  describe('updatingResourceToManyRelationships', function() {
    it('must update homogeneous to-Many relationship with an object with type and id members under links', function(done) {
      var readReq = {
        params: {
          id: 1
        },
        headers: {
          'accept': 'application/vnd.api+json'
        },
        query: {
          include: 'stores'
        }
      };
      var updateData = {
        id: 1,
        type: 'books',
        links: {
          stores: {type: 'stores', id: ['1', '2']}
        }
      };

      updateReq.body.data = updateData;

      var bookRouteHandler = bookController.update({
        responder: function(payload) {
          expect(payload.code).to.equal('200');
          expect(payload.data).to.be.an('object');

          bookController.read({
            responder: function(payload) {
              var secondRead = payload.data;
              var payloadLinks = secondRead.data[0].links;
              var updateLinks = updateData.links;

              expect(secondRead.included.length).to.equal(2);
              expect(payloadLinks.stores.id).to.deep.equal(updateLinks.stores.id);
              done();
            }
          })(readReq);
        }
      });
      bookRouteHandler(_.cloneDeep(updateReq));
    });

    it('must attempt to remove to-Many relationships with the id member of the data object set to []', function(done) {
      var readReq = {
        params: {
          id: 1
        },
        headers: {
          'accept': 'application/vnd.api+json'
        },
        query: {
          include: 'stores'
        }
      };
      var updateData = {
        id: 1,
        type: 'books',
        links: {
          stores: {type: 'stores', id: []}
        }
      };

      updateReq.body.data = updateData;

      var bookRouteHandler = bookController.update({
        responder: function(payload) {
          expect(payload.code).to.equal('200');
          expect(payload.data).to.be.an('object');

          bookController.read({
            responder: function(payload) {
              var secondRead = payload.data;
              var payloadLinks = secondRead.data[0].links;
              var updateLinks = updateData.links;

              expect(secondRead).to.not.have.property('included');
              expect(payloadLinks.stores.id).to.deep.equal(updateLinks.stores.id);
              done();
            }
          })(readReq);
        }
      });
      bookRouteHandler(_.cloneDeep(updateReq));
    });

    // Endpoints does not support heterogenous to-Many relationships
    // it('must require heterogeneous to-Many relationship links to be an object with a data member containing an array of objects with type and id members');
  });

  describe('responses', function() {

    describe('204NoContent', function() {
      it('must return 204 No Content on a successful update when attributes remain up-to-date', function(done) {
        var storeRouteHandler = storeController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('204');
            done();
          }
        });
        storeRouteHandler(req({
          params: {id: 1},
          body: {data: {type: 'stores', id: 1, name: 'Updated Store'}}
        }));
      });
    });

    describe('200Ok', function() {
      it('must return 200 OK if it accepts the update but changes the resource in some way', function(done) {
        var bookRouteHandler = bookController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('200');
            expect(payload.data).to.be.an('object');
            done();
          }
        });
        bookRouteHandler(updateReq);
      });
      it('must include a representation of the updated resource on a 200 OK response');
    });

    // API decision to not create the route - endpoints will always support updating
    // describe('403Forbidden', function() {
    //   it('must return 403 Forbidden on an unsupported request to update a resource or relationship');
    // });

    describe('404NotFound', function() {
      it('must return 404 Not Found when processing a request to modify a resource that does not exist', function(done) {
        updateReq.body.data.id = '9999';
        updateReq.params.id = '9999';
        var bookRouteHandler = bookController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('404');
            done();
          }
        });
        bookRouteHandler(updateReq);
      });

      it('must return 404 Not Found when processing a request that references a to-One related resource that does not exist', function(done) {
        var updateData = {
          id: 1,
          type: 'books',
          links: {
            author: {type: 'authors', id: '9999'},
          }
        };
        updateReq.body.data = updateData;

        var bookRouteHandler = bookController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('404');
            done();
          }
        });
        bookRouteHandler(_.cloneDeep(updateReq));
      });

      it('must return 404 Not Found when processing a request that references a to-Many related resource that does not exist', function(done) {
        var updateData = {
          id: 1,
          type: 'books',
          links: {
          stores: {type: 'stores', id: ['9999']}
          }
        };
        updateReq.body.data = updateData;

        var bookRouteHandler = bookController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('404');
            done();
          }
        });
        bookRouteHandler(_.cloneDeep(updateReq));
      });
    });

    describe('409Conflict', function() {
      it('should return 409 Conflict when processing an update that violates server-enforced constraints', function(done) {
        var updateData = {
          id: 1,
          type: 'books',
          links: {
            author: null
          }
        };

        updateReq.body.data = updateData;

        var bookRouteHandler = bookController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('409');
            done();
          }
        });
        bookRouteHandler(_.cloneDeep(updateReq));
      });

      it('must return 409 Conflict when processing a request where the id does not match the endpoint', function(done) {
        updateReq.body.data.id = 2;
        var bookRouteHandler = bookController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('409');
            done();
          }
        });
        bookRouteHandler(updateReq);
      });

      it('must return 409 Conflict when processing a request where the type does not match the endpoint', function(done) {
        updateReq.body.data.type = 'authors';
        var bookRouteHandler = bookController.update({
          responder: function(payload) {
            expect(payload.code).to.equal('409');
            done();
          }
        });
        bookRouteHandler(updateReq);
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

// Many of these tests should be route tests, but we will test the associated
// API calls for endpoints.
describe('updatingRelationships', function() {

  // Let's take as given that to-One relationship URLs work (e.g. /authors/1)
  // This functionality is part of the standard `read` suite.

  it('should respond to requests to links it sets as to-Many relationship URLs');
  it('should respond to requests to links it sets as nested relationship URLs');

  describe('updatingToOneRelationships', function() {
    it('must respond to PUT request to a to-one relationship URL');
    it('must require a top-level data member containing either an object with type and id members or null');
    it('must return a 204 No Content on a successful PUT request');
  });

  describe('updatingToManyRelationships', function() {
    it('must respond to PUT, POST, and DELETE requests to a to-many relationship URL');
    it('must require a top-level data member containing either an object with type and id members or an array of such objects');
    it('must completely replace every member of the relationship on a PUT request if allowed');
    it('must return an appropriate error if some resources cannot be found or accessed');
    it('must return a 403 Forbidden if complete replacement is not allowed by the server');
    it('must append specified members of a POST request');
    it('must not add existing type and id combinations again');
    it('must return a 204 No Content if the resource is successfully added or already present');
    it('must either DELETE members of the relationship or return 403 Forbidden on a DELETE request');
    it('must return a 204 No Content if the resource is successfully deleted or is already missing');
  });

  describe('responses', function() {

    describe('204NoContent', function() {
      it('must return 204 No Content if the update is successful and the attributes remain up to date');
    });

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
