'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _Controller = require('../');

var _Controller2 = _interopRequireDefault(_Controller);

var _adapter = require('./mocks/adapter');

var _adapter2 = _interopRequireDefault(_adapter);

var _model = require('./mocks/model');

var _model2 = _interopRequireDefault(_model);

var controller = new _Controller2['default']({
  adapter: _adapter2['default'],
  model: _model2['default']
});

describe('Controller', function () {

  it('should be an object', function () {
    _expect.expect(controller).to.be.an('object');
  });

  describe('constructor', function () {

    it('should throw if no adapter is specified', function () {
      _expect.expect(function () {
        new _Controller2['default']();
      }).to['throw']('No adapter specified.');
    });

    it('should throw if no model is specified', function () {
      _expect.expect(function () {
        new _Controller2['default']({
          adapter: _adapter2['default']
        });
      }).to['throw']('No model specified.');
    });
  });

  describe('extending', function () {

    it('should be extendable in es5', function () {
      var adapter = require('./mocks/adapter');
      var validators = ['validators'];

      var MyController = _Controller2['default'].extend({
        adapter: adapter,
        validators: validators,
        allowClientGeneratedIds: true
      });
      var myController = new MyController({
        model: require('./mocks/model')
      });
      _expect.expect(myController.config.adapter).to.equal(adapter);
      _expect.expect(myController.config.allowClientGeneratedIds).to.be['true'];
      _expect.expect(myController.config.validators).to.equal(validators);
    });
  });

  describe('lib', function () {

    require('./lib/adapter_has');
    require('./lib/validate');
  });

  describe('#create', function () {

    it('should return a request handling function', function () {
      _expect.expect(controller.create()).to.be.a('function');
    });
  });

  describe('#read', function () {

    it('should return a request handling function', function () {
      _expect.expect(controller.read()).to.be.a('function');
    });
  });

  describe('#update', function () {

    it('should return a request handling function', function () {
      _expect.expect(controller.update()).to.be.a('function');
    });
  });

  describe('#destroy', function () {

    it('should return a request handling function', function () {
      _expect.expect(controller.destroy()).to.be.a('function');
    });
  });
});