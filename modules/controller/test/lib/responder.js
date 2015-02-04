const expect = require('chai').expect;

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
      set: function (type, value) {
        expect(type).to.equal('content-type');
        expect(value).to.equal('application/json');
        return this;
      },
      status: function (code) {
        expect(code).to.equal(code);
        return this;
      },
      send: function (body) {
        expect(body).to.equal(data);
        return this;
      }
    };
    responder(response, code, data);
  }),

  it('should be able to use hapi-type response objects', function () {
    var code = 200;
    var data = {
      resource: {
        id: 1,
        name: 'foo'
      }
    };
    var response = function (body) {
      expect(body).to.equal(data);
      return {
        type: function (type) {
          expect(type).to.equal('application/json');
          return this;
        },
        code: function (code) {
          expect(code).to.equal(200);
          return this;
        }
      };
    };
    response.request = true;
    responder(response, code, data);
  });

});
