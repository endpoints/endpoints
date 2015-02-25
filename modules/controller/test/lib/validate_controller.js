const expect = require('chai').expect;

const source = require('../mocks/source');
const validateController = require('../../lib/validate_controller');

describe('validateController', function() {
  var config;
  beforeEach(function() {
    config = {
      sourceMethod: 'create',
      filter: {},
      include: []
    };
  });

  it('should return an empty array if filters are valid', function() {
    config.filter.id = 1;
    var result = validateController(source, config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an empty array if relations are valid', function() {
    config.include = ['relation'];
    var result = validateController(source, config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an array with content if passed a bad filter', function() {
    config.filter.badFilter = 1;
    var result = validateController(source, config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

  it('should return an array with content if passed a bad relation', function() {
    config.include = ['badRelation'];
    var result = validateController(source, config);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

  it('should not return an error on the read method even if it is not on the model', function() {
    config.sourceMethod = 'read';
    var result = validateController(source, config);
    expect(source.model.read).to.be.undefined;
    expect(source.model.prototype.read).to.be.undefined;
    expect(result.length).to.equal(0);
  });

  it('should not return an error on the readRelation method even if it is not on the model', function() {
    config.sourceMethod = 'readRelation';
    var result = validateController(source, config);
    expect(source.model.readRelation).to.be.undefined;
    expect(source.model.prototype.readRelation).to.be.undefined;
    expect(result.length).to.equal(0);
  });

  it('should look for the create method on the model', function() {
    config.sourceMethod = 'create';
    var result = validateController(source, config);
    expect(source.model.create).to.exist;
    expect(source.model.prototype.create).to.be.undefined;
    expect(result.length).to.equal(0);
  });

  it('should look for the destroy method on the model prototype', function() {
    config.sourceMethod = 'destroy';
    var result = validateController(source, config);
    expect(source.model.destroy).to.be.undefined;
    expect(source.model.prototype.destroy).to.exist;
    expect(result.length).to.equal(0);
  });

  it('should look for the update method on the model prototype', function() {
    config.sourceMethod = 'update';
    var result = validateController(source, config);
    expect(source.model.update).to.be.undefined;
    expect(source.model.prototype.update).to.exist;
    expect(result.length).to.equal(0);
  });
});
