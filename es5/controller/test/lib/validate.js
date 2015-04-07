'use strict';

var expect = require('chai').expect;

var Adapter = require('../mocks/adapter');

var adapter = new Adapter({
  model: require('../mocks/model')
});

var validate = require('../../lib/validate');

describe('validate', function () {
  var config;
  beforeEach(function () {
    config = {
      filter: {},
      include: []
    };
  });

  it('should return an empty array if filters are valid', function () {
    config.filter.id = 1;
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an empty array if relations are valid', function () {
    config.include = ['relation'];
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });

  it('should return an array with content if passed a bad filter', function () {
    config.filter.badFilter = 1;
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

  it('should return an array with content if passed a bad relation', function () {
    config.include = ['badRelation'];
    var result = validate('create', config, adapter);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
  });

  it('should not return an error on the read method even if it is not on the model', function () {
    var result = validate('read', config, adapter);
    expect(adapter.model.read).to.be.undefined;
    expect(adapter.model.prototype.read).to.be.undefined;
    expect(result.length).to.equal(0);
  });

  it('should look for the create method on the model', function () {
    var result = validate('create', config, adapter);
    expect(adapter.model.create).to.exist;
    expect(adapter.model.prototype.create).to.be.undefined;
    expect(result.length).to.equal(0);
  });

  it('should look for the destroy method on the model prototype', function () {
    var result = validate('destroy', config, adapter);
    expect(adapter.model.destroy).to.be.undefined;
    expect(adapter.model.prototype.destroy).to.exist;
    expect(result.length).to.equal(0);
  });

  it('should look for the update method on the model prototype', function () {
    var result = validate('update', config, adapter);
    expect(adapter.model.update).to.be.undefined;
    expect(adapter.model.prototype.update).to.exist;
    expect(result.length).to.equal(0);
  });
});