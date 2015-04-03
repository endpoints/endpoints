const expect = require('chai').expect;

const Adapter = require('../mocks/adapter');

const adapter = new Adapter({
  model: require('../mocks/model')
});

const validate = require('../../lib/validate');

describe('validate', () => {
  var config;
  beforeEach(() => {
    config = {
      filter: {},
      include: []
    };
  });

  it('should return an empty array if filters are valid', () => {
    config.filter.id = 1;
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an empty array if relations are valid', () => {
    config.include = ['relation'];
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an array with content if passed a bad filter', () => {
    config.filter.badFilter = 1;
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

  it('should return an array with content if passed a bad relation', () => {
    config.include = ['badRelation'];
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

  it('should not return an error on the read method even if it is not on the model', () => {
    var result = validate('read', config, adapter);
    expect(adapter.model.read).to.be.undefined;
    expect(adapter.model.prototype.read).to.be.undefined;
    expect(result.length).to.equal(0);
  });

  it('should look for the create method on the model', () => {
    var result = validate('create', config, adapter);
    expect(adapter.model.create).to.exist;
    expect(adapter.model.prototype.create).to.be.undefined;
    expect(result.length).to.equal(0);
  });

  it('should look for the destroy method on the model prototype', () => {
    var result = validate('destroy', config, adapter);
    expect(adapter.model.destroy).to.be.undefined;
    expect(adapter.model.prototype.destroy).to.exist;
    expect(result.length).to.equal(0);
  });

  it('should look for the update method on the model prototype', () => {
    var result = validate('update', config, adapter);
    expect(adapter.model.update).to.be.undefined;
    expect(adapter.model.prototype.update).to.exist;
    expect(result.length).to.equal(0);
  });
});
