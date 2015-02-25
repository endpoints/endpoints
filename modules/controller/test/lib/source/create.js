/*const sinon = require('sinon');
const bluebird = require('bluebird');

const source = require('../../mocks/source');
const create = require('../../lib/source/create');

describe.only('create', function() {
  var createStub, byIdStub, opts, req;

  beforeEach(function() {
    createStub = sinon.stub(source, 'create').returnsThis();
    byIdStub = sinon.stub(source, 'byId').returns(new bluebird.Promise(function(resolve, reject) {
      resolve();
    }));
    opts = {method:'create'};
    req = {body:{data:{}}};
  });

  afterEach(function() {
    createStub.restore();
    byIdStub.restore();
  });

  it('should call source.create when no id is included in the data', function() {
    create(source, opts, req);
    expect(createStub.calledOnce).to.be.true;
  });

  it('should call source.byId when an id is included in the data', function() {
    req.body.data.id = 1;
    create(source, opts, req);
    expect(byIdStub.calledOnce).to.be.true;
    expect(byIdStub.getCall(0).args[0]).to.equal(1);
  });

  it('should call source.create if an id is included that does not match an existing model');
});
*/
