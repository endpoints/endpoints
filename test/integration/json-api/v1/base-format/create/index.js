const expect = require('chai').expect;
const agent = require('../../../../../agent');

const App = require('../../../../../app');

describe.only('creatingResources', function() {
  var bookData;

  beforeEach(function() {
    bookData = {
      'type': 'books',
      'title': 'The Lost Book of Tolkien',
      'date_published': '2015-02-17',
      links: {
        author: {type: 'authors', id: '1'},
        series: {type: 'series', id: '1'},
        stores: {type: 'stores', id: ['1']}
      }
    };
    return App.reset();
  });

  it('must require an ACCEPT header specifying the JSON API media type', function(done) {
    agent.request('POST', '/books')
      .accept('')
      .end(function(err, res) {
        expect(res.status).to.equal(406);
        done();
      });
  });

  it('must respond to a successful request with an object', function(done) {
    agent.request('POST', '/books')
      .send({ data: bookData })
      .end(function(err, res) {
        expect(res.status).to.be.within(200, 299);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('must respond to an unsuccessful request with a JSON object containing a collection keyed by "errors" in the top level', function(done) {
    agent.request('POST', '/books')
      .send({})
      .end(function(err, res) {
        expect(res.status).to.be.within(400, 499); // any error
        expect(res.body).to.be.an('object');
        expect(res.body.errors).to.be.an('array');
        done();
      });
  });

  it('must not include any top-level members other than "data," "meta," "links," or "included"', function(done) {
    var allowedTopLevel = ['data', 'included', 'links', 'meta'];
    agent.request('POST', '/books')
      .send({ data: bookData })
      .end(function(err, res) {
        Object.keys(res.body).forEach(function(key) {
          expect(allowedTopLevel).to.contain(key);
        });
        done();
      });
  });

  it('must require a content-type header of application/vnd.api+json', function(done) {
    agent.request('POST', '/books')
      .type('application/json')
      .send({ data: bookData })
      .end(function(err, res) {
        expect(res.status).to.equal(415);
        done();
      });
  });

  // TODO: Source/DB test: verify rollback on error
  // it('must not allow partial updates');

  it('must require a single resource object as primary data', function(done) {
    agent.request('POST', '/books')
      .send({ data: [bookData] })
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('must require primary data to have a type member', function(done) {
    delete bookData.type;
    agent.request('POST', '/books')
      .send({ data: bookData })
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  describe('clientGeneratedIds', function() {
    it('may accept a client-generated ID along with a request to create a resource', function(done) {
      bookData.id = 9999;

      agent.request('POST', '/books')
        .send({ data: bookData })
        .end(function(err, res) {
          expect(res.status).to.equal(201);

          var data = res.body.data;
          expect(data.id).to.equal(String(bookData.id));
          expect(data.date_published).to.equal(bookData.date_published);
          expect(data.title).to.equal(bookData.title);
          done();
        });
    });

    // Pending https://github.com/endpoints/endpoints/issues/51
    it.skip('must return 403 Forbidden in response to an unsupported request using a client-generated ID');
  });

  describe('responses', function() {

    describe('201Created', function() {
      it('must respond to a successful resource creation', function(done) {
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            expect(res.status).to.equal(201);
            done();
          });
      });

      // This test currently fails, location isn't correct.
      it.skip('must include a Location header identifying the location of the new resource', function(done) {
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            var location = res.headers.location;
            var book = res.body.data;
            var expectedLocation = App.baseUrl + '/books/' + book.id;

            expect(location).to.equal(expectedLocation);
            done();
          });
      });

      // This seems like a complete dupe of two tests ago
      it.skip('must respond with 201 on a successful request if the request did not include a client-generated ID', function(done) {
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            expect(res.status).to.equal(201);
            done();
          });
      });

      it('must include a document containing the primary resource created', function(done) {
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            var data = res.body.data;
            expect(res.status).to.equal(201);
            expect(data).to.have.property('id');
            expect(data.date_published).to.equal(bookData.date_published);
            expect(data.title).to.equal(bookData.title);
            done();
          });
      });

      it('must make the self link and Location header the same', function(done) {
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            expect(res.headers.location).to.equal(res.body.data.links.self);
            done();
          });
      });

      it('must add all relations', function(done) {
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            expect(res.status).to.equal(201);
            var createData = res.body.data;
            expect(createData.id).to.be.a('string');

            agent.request('GET', '/books/' + createData.id + '?include=stores')
              .end(function(err, res) {
                var readResult = res.body;
                var payloadData = readResult.data;
                var payloadLinks = payloadData.links;

                expect(readResult.included.length).to.equal(1);
                expect(readResult.included[0].id).to.equal(bookData.links.stores.id[0]);
                expect(payloadData.title).to.equal(bookData.title);
                expect(payloadData.date_published).to.equal(bookData.date_published);
                expect(payloadLinks.author.id).to.equal(bookData.links.author.id);
                expect(payloadLinks.series.id).to.equal(bookData.links.series.id);
                expect(payloadLinks.stores.id).to.deep.equal(bookData.links.stores.id);
                done();
              });
          });
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
        bookData.id = 1;
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            expect(res.status).to.equal(409);
            done();
          });
      });

      it('must return 409 Conflict when processing a request where the type does not match the endpoint', function(done) {
        bookData.type = 'authors';
        agent.request('POST', '/books')
          .send({ data: bookData })
          .end(function(err, res) {
            expect(res.status).to.equal(409);
            done();
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
