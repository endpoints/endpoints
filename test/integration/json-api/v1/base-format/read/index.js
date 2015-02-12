const expect = require('chai').expect;

const DB = require('../../../../../fixtures/classes/database');
const authorController = require('../../../../../fixtures/controllers/authors');
const bookController = require('../../../../../fixtures/controllers/books');

var req = require('../../../../../fixtures/mocks/express_request')();

describe('read', function() {

  beforeEach(function() {
    return DB.reset();
  });

  describe('documentStructure', function() {

    describe('topLevel', function() {
      it('must respond to a successful request with an object', function() {
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data).to.be.an('object');
          }
        });
        authorRouteHandler(req);
      });
      it('must respond to an unsuccessful request with a JSON object', function() {

        DB.empty().then(function() {
          var authorRouteHandler = authorController.read({
            responder: function(payload) {
              expect(payload.code).to.equal(400);
              expect(payload.data).to.be.an('object');
            }
          });
          authorRouteHandler({params:{}});
        });
      });
      it('must place primary data under a top-level key named "data"', function() {
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data).to.have.property('data');
          }
        });
        authorRouteHandler(req);
      });
      it('must make primary data for a single record an object', function() {
        var authorRouteHandler = authorController.read({
          one: true,
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data.data).to.be.an('object');
          }
        });
        authorRouteHandler(req);
      });
      it('must make primary data for multiple records an array', function() {
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data.data).to.be.an('array');
          }
        });
        authorRouteHandler(req);
      });
      it('must not include any top-level members other than "data," "meta," or "links," "linked"', function() {
        var allowedTopLevel = ['data', 'linked', 'links', 'meta'];
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            Object.keys(payload.data).forEach(function(key) {
              expect(allowedTopLevel).to.contain(key);
            });
          }
        });
        authorRouteHandler(req);
      });
    });

    describe('resourceObjects', function() {

      describe('resourceAttributes', function() {
        it('must not contain a foreign key as an attribute', function() {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data).to.be.an('object');
              expect(payload.data.data).to.not.have.property('author_id');
              expect(payload.data.data).to.not.have.property('series_id');
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
        it('must include relations as linked resources', function() {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data).to.be.an('object');
              expect(payload.data.data.links).to.have.property('author');
              expect(payload.data.data.links).to.have.property('series');
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
      });

      describe('resourceIdentification', function() {
        it('must have a unique type and id pair');
      });

      describe('resourceTypes', function() {
        it('must contain a type', function() {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data).to.have.property('type');
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
        it('must have a string value for type', function() {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data.type).to.be.a('string');
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
      });

      describe('resourceIds', function() {
        it('must contain an id', function() {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data).to.have.property('id');
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
        it('must have a string value for type', function() {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data.id).to.be.a('string');
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
      });

      describe('links', function() {
        it('must have a json object as the value of any links key');
      });

      describe('resourceURLs', function() {
        it('should include a URL in its links object keyed by "self" that identifies the resource represented by this object');
        it('must respond to a get request to any `self` url with the resource as primary data');
      });

      describe('resourceRelationships', function() {
        it('should contain references to related objects in the links object');
        it('shall not have a relationship to another object keyed as "self"');
        it('must be either a string URL or a link object');

        describe('stringURLRelationship', function() {
          it('should not change related URL even when the resource changes');
        });

        describe('linkObjectRelationship', function() {
          it('must contain either a "self," "resource," "meta" property or an object linkage');
          it('must express object linkages as type and id for to-one relationships');
          it('must express object linkages as type and ids for to-many relationships');
          it('must express object linkages as a data member whose value is an array of objects containing type and id for heterogeneous to-many relationships');
          it('must include object linkage to resource objects included in the same compound document');
        });
      });
    });

    describe('compoundDocuments', function() {
      it('should include linked resources');
      it('must include linked resources as an array of resource objects in a top level `linked` member');
      it('must not include more than one resource object for each type and id pair');
    });

    describe('metaInformation', function() {
      // The document MAY be extended to include meta-information as
      // "meta" members in several locations: at the top-level,
      // within resource objects, and within link objects.
      it('must be an object value');
    });

    describe('topLevelLinks', function() {
      // it('should include a self link'); // superceded above
      it('should include pagination links if necessary');
    });
  });

  describe('inclusionOfLinkedResources', function() {
    it('should include linked resources by default');
    it('should support custom inclusion of linked resources based upon an include request parameter');
    it('must not include other resource objects in the linked section when the client specifies an include parameter');
    it('must have the identical relationship name as the key in the links section of the parent resource object');
  });

  describe('sparseFieldsets', function() {
    it('should support returning only specific fields in the response on a per-type basis by including a fields[TYPE] parameter');
    it('must not include other fields when the client specifies sparse fieldsets');
  });

  describe('sorting', function() {
    it('should support requests to sort collections with a sort query parameter');
    it('should support multiple sort criteria using comma-separated fields');
    it('should sort multiple criteria in the order specified');
    it('must sort ascending or descending based on explicit sort order using "+" or "-"');
  });

  describe('pagination', function() {
    it('should limit the number of resources returned in a response to a subset of the whole set available');
    it('should provide links to traverse a paginated data set');
    it('must put any pagination links on the object that corresponds to a collection');
    it('must only use "first," "last," "prev," and "next" as keys for pagination links');
    it('must omit or set values to null for links that are unavailable');
    it('must remain consistent with the sorting rules');
  });

  describe('filtering', function() {
    it('must only use the filter query parameter for filtering data');
  });
});
