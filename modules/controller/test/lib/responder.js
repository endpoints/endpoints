const expect = require('chai').expect;
const sinon = require('sinon');

const responder = require('../../lib/responder');

describe('responder', function () {

  it('should throw if hapi or express is not detected', function () {
    expect(function () {
      responder({});
    }).to.throw('Unsupported server type!');
  });

  it('should be able to use express-type response objects', function () {
    var code = 200;
    var data = {
      resource: {
        id: 1,
        name: 'foo'
      }
    };
    var response = {
      set: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis()
    };
    responder(response, code, data);
    expect(response.set.calledWith('content-type', 'application/json')).to.be.true;
    expect(response.status.calledWith(code)).to.be.true;
    expect(response.send.calledWith(data)).to.be.true;
  }),

  it('should be able to use hapi-type response objects', function () {
    var code = 200;
    var data = {
      resource: {
        id: 1,
        name: 'foo'
      }
    };
    var stubReturn = {
      type: sinon.stub().returnsThis(),
      code: sinon.stub().returnsThis()
    };
    var response = sinon.stub().returns(stubReturn);
    response.request = true;
    responder(response, code, data);
    expect(response.calledWith(data)).to.be.true;
    expect(stubReturn.type.calledWith('application/json')).to.be.true;
    expect(stubReturn.code.calledWith(code)).to.be.true;
  });

});
