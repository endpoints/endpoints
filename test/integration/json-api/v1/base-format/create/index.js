const expect = require('chai').expect;

const DB = require('../../../../../fixtures/classes/database');
const bookController = require('../../../../../fixtures/controllers/books');

var req = require('../../../../../fixtures/mocks/express_request');

var createReq;

describe('creatingResources', function() {

  beforeEach(function() {
    createReq = req({
      body: {
        data: {
          'type': 'books',
          'series_id': 1,
          'author_id': 1,
          'title': 'The Lost Book of Tolkien',
          'date_published': '2015-02-17'
        }
      }
    });
    return DB.reset();
  });

  it('must require an ACCEPT header specifying the JSON API media type', function(done) {
    var bookRouteHandler = bookController.read({
      responder: function(payload) {
        expect(payload.code).to.equal(406);
        done();
      }
    });
    createReq.headers = { accept: '' };
    bookRouteHandler(createReq);
  });

  it('must respond to a successful request with an object', function(done) {
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        expect(payload.data).to.be.an('object');
        done();
      }
    });
    bookRouteHandler(createReq);
  });

  it('must respond to an unsuccessful request with a JSON object', function(done) {
    createReq.body = {};
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        expect(payload.code).to.be.within(400, 499); // any error
        expect(payload.data).to.be.an('object');
        done();
      }
    });
    bookRouteHandler(createReq);
  });

  it.skip('must not include any top-level members other than "data," "meta," "links," or "linked"', function(done) {
    var allowedTopLevel = ['data', 'linked', 'links', 'meta'];
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        Object.keys(payload.data).forEach(function(key) {
          expect(allowedTopLevel).to.contain(key);
        });
        done();
      }
    });
    bookRouteHandler(createReq);
  });

  it('must require a content-type header of application/vnd.api+json', function(done) {
    createReq.headers['content-type'] = '';
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        expect(payload.code).to.equal(415);
        done();
      }
    });
    bookRouteHandler(createReq);
  });

  // TODO: Source/DB test: verify rollback on error
  // it('must not allow partial updates');

  it('must require a single resource object as primary data', function(done) {
    createReq.body.data = [createReq.body.data];
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        expect(payload.code).to.equal(400);
        done();
      }
    });
    bookRouteHandler(createReq);
  });

  it('must require primary data to have a type member', function(done) {
    delete createReq.body.data.type;
    var bookRouteHandler = bookController.create({
      responder: function(payload) {
        expect(payload.code).to.equal(400);
        done();
      }
    });
    bookRouteHandler(createReq);
  });

  describe('clientGeneratedIds', function() {
    it('may accept a client-generated ID along with a request to create a resource', function(done) {
      createReq.body.data.id = 9999;
      var bookRouteHandler = bookController.create({
        responder: function(payload) {
          var data = payload.data.data;
          expect(payload.code).to.equal(201);
          expect(data.id).to.equal(String(createReq.body.data.id));
          expect(data.date_published).to.equal(createReq.body.data.date_published);
          expect(data.title).to.equal(createReq.body.data.title);
          done();
        }
      });
      bookRouteHandler(createReq);
    });

    // Pending https://github.com/endpoints/endpoints/issues/51
    it('must return 403 Forbidden in response to an unsupported request using a client-generated ID');
  });

  describe('responses', function() {

    describe('201Created', function() {
      it('must respond to a successful resource creation', function(done) {
        var bookRouteHandler = bookController.create({
          responder: function(payload) {
            expect(payload.code).to.equal(201);
            done();
          }
        });
        bookRouteHandler(createReq);
      });

      it('must include a Location header identifying the location of the new resource', function(done) {
        var bookRouteHandler = bookController.create({
          responder: function(payload) {
            expect(payload.headers.location).to.equal('/books/' + payload.data.data.id);
            done();
          }
        });
        bookRouteHandler(createReq);
      });

      it('must respond with 201 on a successful request if the request did not include a client-generated ID', function(done) {
        var bookRouteHandler = bookController.create({
          responder: function(payload) {
            expect(payload.code).to.equal(201);
            done();
          }
        });
        bookRouteHandler(createReq);
      });

      it('must include a document containing the primary resource created', function(done) {
        var bookRouteHandler = bookController.create({
          responder: function(payload) {
            var data = payload.data.data;
            expect(payload.code).to.equal(201);
            expect(data).to.have.property('id');
            expect(data.date_published).to.equal(createReq.body.data.date_published);
            expect(data.title).to.equal(createReq.body.data.title);
            done();
          }
        });
        bookRouteHandler(createReq);
      });

      it('must make the self link and Location header the same', function(done) {
        var bookRouteHandler = bookController.create({
          responder: function(payload) {
            expect(payload.headers.location).to.equal(payload.data.data.links.self);
            done();
          }
        });
        bookRouteHandler(createReq);
      });
    });

    // Endpoints will respond with a 201 on all create requests
    // Tested above.
    // describe('204NoContent', function() {
    //   it('must respond with either 201 or 204 if the request included a client-generated ID');
    // });

    // API decision to not create the route - endpoints will always support creation
    // describe('403Forbidden', function() {
    //   it('should return 403 Forbidden in response to an unsupported creation request');
    // });

    describe('409Conflict', function() {
      it('must return 409 Conflict when processing a request to create a resource with an existing client-generated ID', function(done) {
        createReq.body.data.id = 1;
        var bookRouteHandler = bookController.create({
          responder: function(payload) {
            expect(payload.code).to.equal(409);
            done();
          }
        });
        bookRouteHandler(createReq);
      });

      it('must return 409 Conflict when processing a request where the type does not match the endpoint', function(done) {
        createReq.body.data.type = 'authors';
        var bookRouteHandler = bookController.create({
          responder: function(payload) {
            expect(payload.code).to.equal(409);
            done();
          }
        });
        bookRouteHandler(createReq);
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
