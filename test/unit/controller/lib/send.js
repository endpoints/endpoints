import {expect} from 'chai';
import sinon from 'sinon';

import { express, hapi } from '../../../../src/controller/lib/send';

describe('send', () => {
  let res;
  let payload;

  beforeEach(() => {

    payload = {
      code: 1,
      data: [],
      headers: {
        'header': 'value'
      }
    };

  });

  describe('#express', () => {

    beforeEach(() => {
      res = {
        headers: {},
        set(key, value) {
          this.headers[ key ] = value;
          return this;
        },
        status(code) {
          this.statusCode = code;
          return this;
        },
        send: null
      };
    });

    it('should call send with the data', () => {
      res.send = sinon.spy();
      express(res, payload);

      expect(res.send.withArgs([]).calledOnce).to.be.true;

    });

    it('should add the headers to the response', () => {
      res.send = sinon.spy();
      express(res, payload);

      expect(res.headers.header).to.deep.equal(payload.headers.header);

    });

    it('should add the content type header', () => {
      res.send = sinon.spy();
      express(res, payload);

      expect(res.headers['content-type']).to.equal('application/vnd.api+json');

    });

    it('should set the response code', () => {
      res.send = sinon.spy();
      express(res, payload);

      expect(res.statusCode).to.equal(payload.code);

    });

  });

  describe('#hapi', () => {

    let resData;
    let resType;
    let resStatusCode;

    beforeEach(() => {
      res = function(data) {
        resData = data;
        return {
          type(type) {
            resType = type;
            return this;
          },
          code(code) {
            resStatusCode = code;
            return this;
          }
        };
      };
      res.set = function(key, value) {
        this.headers = this.headers || {};
        this.headers[ key ] = value;
        return this;
      };
    });

    it('should send back the data', () => {
      hapi(res, payload);

      expect(resData).to.deep.equal(payload.data);
    });

    it('should add the headers to the response', () => {
      hapi(res, payload);

      expect(res.headers.header).to.deep.equal(payload.headers.header);

    });

    it('should add the content type', () => {
      hapi(res, payload);

      expect(resType).to.equal('application/vnd.api+json');

    });

    it('should set the response code', () => {
      res.send = sinon.spy();
      hapi(res, payload);

      expect(resStatusCode).to.equal(payload.code);

    });

  });

});
