const expect = require('chai').expect;

const DB = require('../../../../../fixtures/classes/database');
const bookController = require('../../../../../fixtures/controllers/books');

var req;

describe('updatingResources', function() {

  beforeEach(function() {
    req = {
      headers: {
        'content-type': 'application/vnd.api+json'
      },
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
    };
    return DB.reset();
  });

  it('must respond to a successful request with an object', function(done) {
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal(200);
        expect(payload.data).to.be.an('object');
        done();
      }
    });
    bookRouteHandler(req);
  });

  it('must respond to an unsuccessful request with a JSON object', function(done) {
    req.body.data.id = 'asdf';
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal(422);
        expect(payload.data).to.be.an('object');
        done();
      }
    });
    bookRouteHandler(req);
  });


  it('must not include any top-level members other than "data," "meta," "links," or "linked"', function(done) {
    var allowedTopLevel = ['data', 'linked', 'links', 'meta'];
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal(200);
        Object.keys(payload.data).forEach(function(key) {
          expect(allowedTopLevel).to.contain(key);
        });
        done();
      }
    });
    bookRouteHandler(req);
  });


  it('must require a single resource object as primary data');
  it('should allow existing resources to be modified');

  it('must require a content-type header of application/vnd.api+json', function(done) {
    req.headers['content-type'] = '';
    var bookRouteHandler = bookController.update({
      responder: function(payload) {
        expect(payload.code).to.equal(415);
        done();
      }
    });
    bookRouteHandler(req);
  });

  it('must require relevant extensions in the content-type header');
  it('must not allow partial updates');

  describe('updatingResourceAttributes', function() {
    it('should allow any or all attributes to be included in the resource object');
    it('must interpret missing fields as their current values');
    it('must not interpret missing fields as null values');
  });

  describe('updatingResourceToOneRelationships', function() {
    it('must require to-One relationship links to be either an object with type and id or null');
  });

  describe('updatingResourceToManyRelationships', function() {
    it('must require homogeneous to-Many relationship links to be an object with type and ids members');
    it('must require heterogeneous to-Many relationship links to be an object with a data member containing an array of objects with type and id members');
    it('should reject an attempt to do a full replacement of a to-many relationship');
    it('must reject full-replacement atomically and with a 403 Forbidden response');
  });

  describe('responses', function() {

    describe('204NoContent', function() {
      it('must return 204 No Content on a successful update when attributes remain up-to-date');
    });

    describe('200Ok', function() {
      it('must return 200 OK if it accepts the update but changes the resource in some way');
      it('must include a representation of the updated resource on a 200 OK response');
    });

    describe('403Forbidden', function() {
      it('must return 403 Forbidden on an unsupported request to update a resource or relationship');
    });

    describe('404NotFound', function() {
      it('must return 404 Not Found when processing a request to modify a resource that does not exist');
      it('must return 404 Not Found when processing a request that references a related resource that does not exist');
    });

    describe('409Conflict', function() {
      it('should return 409 Conflict when processing an update that violates server-enforced constraints');
      it('must return 409 Conflict when processing a request in which the type and id do not match the endpoint');
    });

    describe('otherResponses', function() {
      it('should use other HTTP codes to represent errors');
      it('must interpret errors in accordance with HTTP semantics');
      it('should return error details');
    });
  });
});

describe('updatingRelationships', function() {
  it('should respond to requests to links it sets as relationship URLs');

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

    describe('403Forbidden', function() {
      it('must return 403 Forbidden in response to an unsupported request to update a relationship');
    });

    describe('otherResponses', function() {
      it('should use other HTTP codes to represent errors');
      it('must interpret errors in accordance with HTTP semantics');
      it('should return error details');
    });
  });
});
