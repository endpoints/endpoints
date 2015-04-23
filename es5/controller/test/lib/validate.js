'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _Adapter = require('../mocks/adapter');

var _Adapter2 = _interopRequireWildcard(_Adapter);

var _validate = require('../../lib/validate');

var _validate2 = _interopRequireWildcard(_validate);

var adapter = new _Adapter2['default']({
  model: require('../mocks/model')
});

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
    var result = _validate2['default']('create', config, adapter);
    _expect.expect(result).to.be.an('array');
    _expect.expect(result.length).to.equal(0);
  });

  it('should return an empty array if relations are valid', function () {
    config.include = ['relation'];
    var result = _validate2['default']('create', config, adapter);
    _expect.expect(result).to.be.an('array');
    _expect.expect(result.length).to.equal(0);
  });

  it('should return an array with content if passed a bad filter', function () {
    config.filter.badFilter = 1;
    var result = _validate2['default']('create', config, adapter);
    _expect.expect(result).to.be.an('array');
    _expect.expect(result.length).to.equal(1);
  });

  it('should return an array with content if passed a bad relation', function () {
    config.include = ['badRelation'];
    var result = _validate2['default']('create', config, adapter);
    _expect.expect(result).to.be.an('array');
    _expect.expect(result.length).to.equal(1);
  });

  it('should not return an error on the read method even if it is not on the model', function () {
    var result = _validate2['default']('read', config, adapter);
    _expect.expect(adapter.model.read).to.be.undefined;
    _expect.expect(adapter.model.prototype.read).to.be.undefined;
    _expect.expect(result.length).to.equal(0);
  });

  it('should look for the create method on the model', function () {
    var result = _validate2['default']('create', config, adapter);
    _expect.expect(adapter.model.create).to.exist;
    _expect.expect(adapter.model.prototype.create).to.be.undefined;
    _expect.expect(result.length).to.equal(0);
  });

  it('should look for the destroy method on the model prototype', function () {
    var result = _validate2['default']('destroy', config, adapter);
    _expect.expect(adapter.model.destroy).to.be.undefined;
    _expect.expect(adapter.model.prototype.destroy).to.exist;
    _expect.expect(result.length).to.equal(0);
  });

  it('should look for the update method on the model prototype', function () {
    var result = _validate2['default']('update', config, adapter);
    _expect.expect(adapter.model.update).to.be.undefined;
    _expect.expect(adapter.model.prototype.update).to.exist;
    _expect.expect(result.length).to.equal(0);
  });
});