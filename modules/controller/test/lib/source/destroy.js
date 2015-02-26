/*
const sinon = require('sinon');
const bluebird = require('bluebird');

const source = require('../../mocks/source');
const destroy = require('../../lib/source/destroy');

describe('destroy', function() {
  var opts, req, byIdStub;

  beforeEach(function() {
    opts = {
      method: 'destroy',
      sourceMethod: 'destroy'
    };
    req = {
      params: {
        id: 1
      },
      body: {
        data: {}
      }
    };
    byIdStub = sinon.stub(source, 'byId').returns(new bluebird.Promise(function(resolve, reject) {
      resolve({related: function() {return true;}});
    }));
  });

  afterEach(function() {
    byIdStub.restore();
  });

  it('should call source.byId', function() {
    destroy(opts, req);
    expect(byIdStub.calledOnce).to.be.true;
  });

  it('should throw if no model is returned from source.byId');
  it('should throw if source.byId errors out');
});
*/
