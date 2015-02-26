const expect = require('chai').expect;
const sinon = require('sinon');
const bluebird = require('bluebird');

const requestHandler = require('../../lib/request_handler');

describe('requestHandler', function() {
  var controllerStub, responderStub;

  beforeEach(function() {
    controllerStub = sinon.stub().returns(new bluebird.Promise(function(resolve, reject) {
      resolve();
    }));
    responderStub = sinon.stub().returnsThis();
  });

  it('should return a function for each request type', function() {
    expect(requestHandler({method:'create'})).to.be.a('function');
    expect(requestHandler({method:'read'})).to.be.a('function');
    expect(requestHandler({method:'readRelated'})).to.be.a('function');
    expect(requestHandler({method:'update'})).to.be.a('function');
    expect(requestHandler({method:'destroy'})).to.be.a('function');
  });

  it('should return a handler that calls the passed-in sourceInterface', function() {
    var req = {
      headers: {
        accept: 'application/vnd.api+json'
      }
    };

    requestHandler({
      method: 'read',
      sourceInterface: controllerStub,
      responder: function () {},
      payload: function () {}
    })(req, {}, function() {});

    expect(controllerStub.calledOnce).to.be.true;
  });

  it('should call the passed-in responder on a validation error', function() {
    requestHandler({
      method: 'read',
      sourceInterface: controllerStub,
      payload: function(err) {return err;},
      responder: responderStub
    })({headers:{}}, {}, function() {});

    expect(responderStub.calledOnce).to.be.true;
    expect(responderStub.getCall(0).args[0]).to.be.instanceof(Error);
    expect(controllerStub.called).to.be.false;
  });

});
