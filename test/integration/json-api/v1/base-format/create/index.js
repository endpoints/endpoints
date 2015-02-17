const expect = require('chai').expect;

const DB = require('../../../../../fixtures/classes/database');
const bookController = require('../../../../../fixtures/controllers/books');

var req = {
  body: {
    data: {
      'series_id': 1,
      'author_id': 1,
      'title': 'The Lost Book of Tolkien',
      'date_published': '2015-02-17'
    }
  }
};

describe('creatingResources', function() {

  beforeEach(function() {
    return DB.reset();
  });

  it('must respond to a successful request with an object', function(done) {
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        expect(payload.code).to.equal(201);
        expect(payload.data).to.be.an('object');
        done();
      }
    });
    bookRouteHandler(req);
  });

  it('must respond to an unsuccessful request with a JSON object', function(done) {

    DB.empty().then(function() {
      var bookRouteHandler = bookController.create({
        responder: function(payload) {
          expect(payload.code).to.equal(422);
          expect(payload.data).to.be.an('object');
          done();
        }
      });
      bookRouteHandler({body:{}});
    });
  });

  it('must not include any top-level members other than "data," "meta," "links," or "linked"', function(done) {
    var allowedTopLevel = ['data', 'linked', 'links', 'meta'];
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        expect(payload.code).to.equal(201);
        Object.keys(payload.data).forEach(function(key) {
          expect(allowedTopLevel).to.contain(key);
        });
        done();
      }
    });
    bookRouteHandler(req);
  });

  it('should allow resources of a given type to be created', function(done) {
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        var data = payload.data.data;
        expect(payload.code).to.equal(201);
        expect(data).to.have.property('id');
        expect(data.date_published).to.equal(req.body.data.date_published);
        expect(data.title).to.equal(req.body.data.title);
        done();
      }
    });
    bookRouteHandler(req);
  });

  it('must require a content-type header of application/vnd.api+json');
  it('must require relevant extensions in the content-type header');
  it('must require a single resource object as primary data');
  it('must not allow partial updates');
  it('must require a type member of the data');

  describe('clientGeneratedIds', function() {
    // A server MAY accept a client-generated ID along with a
    // request to create a resource. An ID MUST be specified
    // with an "id" key, the value of which MUST be a
    // universally unique identifier. The client SHOULD use a
    // properly generated and formatted UUID as described in RFC
    // 4122 [RFC4122].
    it('must return 403 Forbidden in response to an unsupported request using a client-generated ID');
  });

  describe('responses', function() {

    describe('201Created', function() {
      it('must respond to a successful resource creation');
      it('must include a Location header identifying the location of the new resource');
      it('must respond with 201 on a successful request if the request did not include a client-generated ID');
      it('must include a document containing the primary resource created');
      it('must make the self link and Location header the same');
    });

    describe('204NoContent', function() {
      it('must respond with either 201 or 204 if the request included a client-generated ID');
    });

    describe('403Forbidden', function() {
      it('should return 403 Forbidden in response to an unsupported creation request');
    });

    describe('409Conflict', function() {
      it('must return 409 Conflict when processing a request to create a resource with an existing client-generated ID');
      it('must return 409 Conflict when processing a request where the type does not match the endpoint');
    });

    describe('otherResponses', function() {
      it('should use other HTTP codes to represent errors');
      it('must interpret errors in accordance with HTTP semantics');
      it('should return error details');
    });
  });
});
