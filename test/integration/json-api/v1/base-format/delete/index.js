const expect = require('chai').expect;
const _ = require('lodash');

const DB = require('../../../../../fixtures/classes/database');
const bookController = require('../../../../../fixtures/controllers/books');

var req = require('../../../../../fixtures/mocks/express_request');

var destroyReq;

describe('deletingResources', function() {

  beforeEach(function() {
    destroyReq = req({
      params: {
        id: '1'
      }
    });
    return DB.reset();
  });

  it('must respond to a successful request with null', function(done) {
    var bookRouteHandler = bookController.destroy({
      responder: function(payload) {
        expect(payload.code).to.be.within(200, 299);
        expect(payload.data).to.be.null;
        done();
      }
    });
    bookRouteHandler(destroyReq);
  });

  it('must respond to an unsuccessful request with a JSON object', function(done) {
    destroyReq.params.id = '9999';
    var bookRouteHandler = bookController.destroy({
      responder: function(payload) {
        expect(payload.code).to.be.within(400, 499); // any error
        expect(payload.data).to.be.an('object');
        expect(payload.data.errors).to.be.an('array');
        done();
      }
    });
    bookRouteHandler(destroyReq);
  });

  it('must not require a content-type header of application/vnd.api+json', function(done) {
    destroyReq.headers['content-type'] = '';
    var bookRouteHandler = bookController.destroy({
      responder: function(payload) {
        expect(payload.code).to.equal('204');
        done();
      }
    });
    bookRouteHandler(destroyReq);
  });

  // TODO: Source/DB test: verify rollback on error
  // it('must not allow partial updates');

  it('should delete resources when a DELETE request is made to the resource URL', function(done) {
      var firstRead;
      var readReq = {
        headers: {
          'accept': 'application/vnd.api+json'
        }
      };
      var bookRouteHandler = bookController.destroy({
        responder: function(payload) {

          bookController.read({
            responder: function(payload) {
              var secondRead = payload.data;
              expect(secondRead.data.length).to.equal(firstRead.data.length - 1);
              expect(_.pluck(secondRead.data, 'id').indexOf(destroyReq.params.id)).to.equal(-1);
              done();
            }
          })(readReq);
        }
      });

      bookController.read({
        responder: function(payload) {
          firstRead = payload.data;
          expect(_.pluck(firstRead.data, 'id').indexOf(destroyReq.params.id)).to.not.equal(-1);
          bookRouteHandler(destroyReq);
        }
      })(readReq);
  });

  describe('responses', function() {

    describe('204NoContent', function() {
      it('must return 204 No Content on a successful DELETE request', function(done) {
        var bookRouteHandler = bookController.destroy({
          responder: function(payload) {
            expect(payload.code).to.equal('204');
            done();
          }
        });
        bookRouteHandler(destroyReq);
      });
    });

    // FIXME: No longer required: https://github.com/json-api/json-api/commit/e5021bfb355dc3da498888a4378f8339ef45a531
    // describe('404NotFound', function() {
    //   it('must return 404 Not Found when processing a request to delete a resource that does not exist', function(done) {
    //     destroyReq.params.id = 9999;
    //     var bookRouteHandler = bookController.destroy({
    //       responder: function(payload) {
    //         expect(payload.code).to.equal('404');
    //         done();
    //       }
    //     });
    //     bookRouteHandler(destroyReq);
    //   });
    // });

    // Not testable as written. Each error handling branch should be
    // unit-tested for proper HTTP semantics.
    // describe('otherResponses', function() {
    // describe('otherResponses', function() {
    //   it('should use other HTTP codes to represent errors');
    //   it('must interpret errors in accordance with HTTP semantics');
    //   it('should return error details');
    // });
  });
});
