/*const sinon = require('sinon');
const bluebird = require('bluebird');

const source = require('../../mocks/source');
const update = require('../../lib/source/update');

describe('update', function() {
  var opts, req, byIdStub;

  beforeEach(function() {
    opts = {
      method: 'update',
      sourceMethod: 'update'
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
    update(opts, req);
    expect(byIdStub.calledOnce).to.be.true;
  });

  it('should throw if no model is returned from source.byId');
  it('should throw if source.byId errors out');
});
*/
