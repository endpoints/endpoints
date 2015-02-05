const expect = require('chai').expect;
const sinon = require('sinon');

const responder = require('../../lib/responder');

describe('responder', function () {

  it('should throw if no payload is provided', function () {
    expect(function () {
      responder();
    }).to.throw('No payload provided.');
  });

  it('should throw if no request is provided', function () {
    expect(function () {
      responder({});
    }).to.throw('No request provided.');
  });

  it('should throw if no response is provided', function () {
    expect(function () {
      responder({}, {});
    });
  });

  it('should throw if hapi or express is not detected', function () {
    expect(function () {
      responder({}, {}, {});
    }).to.throw('Unsupported server type!');
  });

  it('should be able to use express-type response objects', function () {
    var payload = {
      code: 200,
      data: {
        resource: {
          id: 1,
          name: 'foo'
        }
      }
    };
    var request = {
      accepts: sinon.stub().returns(false)
    };
    var response = {
      set: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis()
    };
    responder(payload, request, response);
    expect(response.set.calledWith('content-type', 'application/json')).to.be.true;
    expect(response.status.calledWith(payload.code)).to.be.true;
    expect(response.send.calledWith(payload.data)).to.be.true;
  }),

  it('should be able to use hapi-type response objects', function () {
    var payload = {
      code: 200,
      data: {
        resource: {
          id: 1,
          name: 'foo'
        }
      }
    };
    var stubReturn = {
      type: sinon.stub().returnsThis(),
      code: sinon.stub().returnsThis()
    };
    var response = sinon.stub().returns(stubReturn);
    response.request = true;
    responder(payload, {}, response);
    expect(response.calledWith(payload.data)).to.be.true;
    expect(stubReturn.type.calledWith('application/json')).to.be.true;
    expect(stubReturn.code.calledWith(payload.code)).to.be.true;
  });

});
