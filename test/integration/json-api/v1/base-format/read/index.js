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
      it('must respond to a successful request with an object', function(done) {
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data).to.be.an('object');
            done();
          }
        });
        authorRouteHandler(req);
      });
      it('must respond to an unsuccessful request with a JSON object', function(done) {

        DB.empty().then(function() {
          var authorRouteHandler = authorController.read({
            responder: function(payload) {
              expect(payload.code).to.equal(400);
              expect(payload.data).to.be.an('object');
              done();
            }
          });
          authorRouteHandler({params:{}});
        });
      });
      it('must place primary data under a top-level key named "data"', function(done) {
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data).to.have.property('data');
            done();
          }
        });
        authorRouteHandler(req);
      });
      it('must make primary data for a single record an object', function(done) {
        var authorRouteHandler = authorController.read({
          one: true,
          filters: {
            id: 1
          },
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data.data).to.be.an('object');
            done();
          }
        });
        authorRouteHandler(req);
      });
      it('must make primary data for multiple records an array', function(done) {
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            expect(payload.data.data).to.be.an('array');
            done();
          }
        });
        authorRouteHandler(req);
      });
      it('must not include any top-level members other than "data," "meta," or "links," "linked"', function(done) {
        var allowedTopLevel = ['data', 'linked', 'links', 'meta'];
        var authorRouteHandler = authorController.read({
          responder: function(payload) {
            expect(payload.code).to.equal(200);
            Object.keys(payload.data).forEach(function(key) {
              expect(allowedTopLevel).to.contain(key);
            });
            done();
          }
        });
        authorRouteHandler(req);
      });
    });

    describe('resourceObjects', function() {

      describe('resourceAttributes', function() {
        it('must not contain a foreign key as an attribute', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              var dataObj = payload.data.data;
              expect(payload.code).to.equal(200);
              expect(dataObj).to.be.an('object');
              expect(dataObj).to.not.have.property('author_id');
              expect(dataObj).to.not.have.property('series_id');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
        it('must include relations as linked resources', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              var dataObj = payload.data.data;
              expect(payload.code).to.equal(200);
              expect(dataObj).to.be.an('object');
              expect(dataObj.links).to.have.property('author');
              expect(dataObj.links).to.have.property('series');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
      });

      // More of a DB/ORM test
      // describe('resourceIdentification', function() {
      //   it('must have a unique type and id pair');
      // });

      describe('resourceTypes', function() {
        it('must contain a type', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data).to.have.property('type');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
        it('must have a string value for type', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data.type).to.be.a('string');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
      });

      describe('resourceIds', function() {
        it('must contain an id', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data).to.have.property('id');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
        it('must have a string value for type', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data.id).to.be.a('string');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
      });

      describe('links', function() {
        it('must have an object as the value of any links key', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              expect(payload.code).to.equal(200);
              expect(payload.data.data.links).to.be.an('Object');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
      });

      describe('resourceURLs', function() {
        it('should include a string in its links object keyed by "self"', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              var links = payload.data.data.links;
              expect(payload.code).to.equal(200);
              expect(links).to.have.property('self');
              expect(links.self).to.be.a('String');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });
        it('should set the value of "self" to a URL that identifies the resource represented by this object', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            filters: {
              id: 1
            },
            responder: function(payload) {
              var links = payload.data.data.links;
              expect(payload.code).to.equal(200);
              expect(links.self).to.equal('/books/1');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });

        // API TEST
        // it('must respond to a get request to any `self` url with the resource as primary data');
      });

      describe('resourceRelationships', function() {
        it('should contain references to related objects in the links object', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              var links = payload.data.data.links;
              expect(payload.code).to.equal(200);
              expect(links).to.have.property('author');
              expect(links).to.have.property('series');
              expect(links).to.have.property('stores');
              expect(links).to.have.property('author.books');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });

        // seems like this is taken care of in the self test above
        // it('shall not have a relationship to another object keyed as "self"');

        it('must make to-one references a link object', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              var links = payload.data.data.links;
              expect(payload.code).to.equal(200);
              expect(links.author).to.be.an('Object');
              expect(links.series).to.be.an('Object');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });

        it('must make to-many references a string URL', function(done) {
          var bookRouteHandler = bookController.read({
            one:true,
            responder: function(payload) {
              var links = payload.data.data.links;
              expect(payload.code).to.equal(200);
              expect(links.stores).to.be.a('String');
              expect(links['author.books']).to.be.a('String');
              expect(links.stores).to.equal('/books/1/stores');
              expect(links['author.books']).to.equal('/books/1/author.books');
              done();
            }
          });
          bookRouteHandler({params: {
            id: 1
          }});
        });

        // currently not implementing string rels - may be a good vector
        // for many-to-many relations in the future
        describe('stringURLRelationship', function() {
          it('should not change related URL even when the resource changes');
        });

        describe('linkObjectRelationship', function() {
          it('must contain either a "self," "resource," "meta" property or an object linkage via a data object or type and id', function(done) {
            var bookRouteHandler = bookController.read({
              one:true,
              responder: function(payload) {
                var linkedAuthor = payload.data.data.links.author;
                var minProp =
                  linkedAuthor.self ||
                  linkedAuthor.resource ||
                  linkedAuthor.meta ||
                  linkedAuthor.data ||
                  (linkedAuthor.type && linkedAuthor.id);
                expect(payload.code).to.equal(200);
                expect(minProp).to.exist;
                done();
              }
            });
            bookRouteHandler({params: {
              id: 1
            }});
          });

          it('must include object linkage to resource objects included in the same compound document', function(done) {
            var bookRouteHandler = bookController.read({
              one:true,
              responder: function(payload) {
                var linkedAuthor = payload.data.data.links.author;
                var objectLinkage =
                  linkedAuthor.data ||
                  (linkedAuthor.type && linkedAuthor.id);

                expect(payload.code).to.equal(200);
                expect(payload.data.linked).to.have.property('authors');
                expect(objectLinkage).to.exist;
                done();
              }
            });
            bookRouteHandler({
              params: {
                id: 1
              },
              query: {
                include: 'author'
              }
            });
          });

          it('must express object linkages as type and id for to-one relationships', function(done) {
            var bookRouteHandler = bookController.read({
              one:true,
              responder: function(payload) {
                var links = payload.data.data.links;
                expect(payload.code).to.equal(200);
                expect(links.author).to.have.property('type');
                expect(links.author).to.have.property('id');
                done();
              }
            });
            bookRouteHandler({
              params: {
                id: 1
              },
              query: {
                // object linkages only require type and id if the
                // relation is in the top-level `linked` object
                // only testing that case here
                include: 'author'
              }
            });
          });
          it('must express object linkages as type and ids for to-many relationships', function(done) {
            var bookRouteHandler = bookController.read({
              one:true,
              responder: function(payload) {
                var links = payload.data.data.links;
                expect(payload.code).to.equal(200);
                expect(links.series).to.have.property('type');
                expect(links.series).to.have.property('id');
                done();
              }
            });
            bookRouteHandler({
              params: {
                id: 1
              },
              query: {
                // object linkages only require type and id if the
                // relation is in the top-level `linked` object
                // only testing that case here
                include: 'series'
              }
            });
          });

          // We don't do polymorphism
          // it('must express object linkages as a data member whose value is an array of objects containing type and id for heterogeneous to-many relationships');
        });
      });
    });

    describe('compoundDocuments', function() {
      it('should include linked resources');
      it('must include linked resources as an array of resource objects in a top level `linked` member');
      it('must not include more than one resource object for each type and id pair');
    });

    // Not currently used by endpoints
    // describe('metaInformation', function() {
    //   it('must be an object value');
    // });

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
