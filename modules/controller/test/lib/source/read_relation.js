/*const sinon = require('sinon');
const bluebird = require('bluebird');

const source = require('../../mocks/source');
const readRelation = require('../../lib/source/read_relation');

describe('readRelation', function() {
  var byIdStub;

  beforeEach(function() {
    byIdStub = sinon.stub(source, 'byId').returns(new bluebird.Promise(function(resolve, reject) {
      resolve({related: function() {return true;}});
    }));
  });

  afterEach(function() {
    byIdStub.restore();
  });

  it('should call source.byId', function() {
    readRelation({}, {params: {id: 1}});
    expect(byIdStub.calledOnce).to.be.true;
  });

  it('should throw if no model is returned from source.byId');
  it('should throw if source.byId errors out');
});
*/
