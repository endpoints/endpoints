import {expect} from 'chai';

import handle from '../../../../src/controller/lib/handle';

describe('handle', () => {
  let config;

  beforeEach(() => {
    config = {
      method: 'read',
      format: () => {
        return {
          format: (arg) => arg,
          read: (config, data) => data,
          process: (config, data) => data,
        };
      },
      store: {
        allRelations: () => ['relation'],
        filters: () => ({
          id: 'a'
        }),
        read: () => Promise.resolve([]),
      },
      validators: [],
    };
  });

  it('should return a function', () => {
    const routeHandler = handle(config);
    expect(routeHandler).to.be.an('function');
  });

  it('should call a custom responder when defined', (done) => {
    const req = {
      params: {},
      query: {}
    };
    const res = {
      set() {
        return this;
      },
      status() {
        return this;
      },
      send(data) {
        expect(true).to.be.true;
        expect(data).to.equal('hello');
        done();
      }
    };
    config.responder = () => {
      return Promise.resolve(res.send('hello'));
    };
    const routeHandler = handle(config);
    routeHandler(req, res);
  });

  it('should call res.send', (done) => {
    const req = {
      params: {},
      query: {}
    };
    const res = {
      set() {
        return this;
      },
      status() {
        return this;
      },
      send(data) {
        expect(true).to.be.true;
        done();
      }
    };
    const routeHandler = handle(config);
    routeHandler(req, res);
  });

});
