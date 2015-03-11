const expect = require('chai').expect;
const superagent = require('superagent');

const App = require('../../../../../app');

describe('deletingResources', function() {

  beforeEach(function() {
    return App.reset();
  });

  it('must not require a content-type header of application/vnd.api+json', function(done) {
    superagent.
      del(App.baseUrl + '/chapters/1').
      set('accept', 'application/vnd.api+json').
      end(function (err, res) {
        expect(res.status).to.equal(204);
        done();
      });
  });

  it('must respond to a successful request with an empty body', function(done) {
    superagent.
      del(App.baseUrl + '/chapters/1').
      set('accept', 'application/vnd.api+json').
      end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        expect(res.body).to.deep.equal({});
        done();
      });
  });

  // this needs fixed!
  it.skip('must respond to an unsuccessful request with a JSON object', function(done) {
    superagent.
      del(App.baseUrl + '/chapters/9999').
      set('content-type', 'application/vnd.api+json').
      set('accept', 'application/vnd.api+json').
      end(function (err, res) {
        expect(res.status).to.be.within(400, 499); // any error;
        expect(res.body).to.be.an('object');
        done();
      });
  });
/*
  // TODO: Source/DB test: verify rollback on error
  // it('must not allow partial updates');

  it('should delete resources when a DELETE request is made to the resource URL', function(done) {
      var firstRead;
      var readReq = {
        headers: {
          'accept': 'application/vnd.api+json'
        },
        params:{}
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

      it('must return 204 No Content when processing a request to delete a resource that does not exist', function(done) {
        destroyReq.params.id = 9999;
        var bookRouteHandler = bookController.destroy({
          responder: function(payload) {
            expect(payload.code).to.equal('204');
            done();
          }
        });
        bookRouteHandler(destroyReq);
      });
    });

    // Not testable as written. Each error handling branch should be
    // unit-tested for proper HTTP semantics.
    // describe('otherResponses', function() {
    // describe('otherResponses', function() {
    //   it('should use other HTTP codes to represent errors');
    //   it('must interpret errors in accordance with HTTP semantics');
    //   it('should return error details');
    // });
  });
  */
});
