'use strict';

var expect = require('chai').expect;

var Controller = require('../');

var adapter = require('./mocks/adapter');
var model = require('./mocks/model');

var controller = new Controller({
  adapter: adapter,
  model: model
});

describe('Controller', function () {

  it('should be an object', function () {
    expect(controller).to.be.an('object');
  });

  describe('constructor', function () {

    it('should throw if no adapter is specified', function () {
      expect(function () {
        new Controller();
      }).to['throw']('No adapter specified.');
    });

    it('should throw if no model is specified', function () {
      expect(function () {
        new Controller({
          adapter: adapter
        });
      }).to['throw']('No model specified.');
    });
  });

  describe('extending', function () {

    it('should be extendable in es5', function () {
      var adapter = require('./mocks/adapter');
      var validators = ['validators'];

      var MyController = Controller.extend({
        adapter: adapter,
        validators: validators,
        allowClientGeneratedIds: true
      });
      var myController = new MyController({
        model: require('./mocks/model')
      });
      expect(myController.config.adapter).to.equal(adapter);
      expect(myController.config.allowClientGeneratedIds).to.be['true'];
      expect(myController.config.validators).to.equal(validators);
    });
  });

  describe('lib', function () {

    require('./lib/adapter_has');
    require('./lib/validate');
  });

  describe('#create', function () {

    it('should return a request handling function', function () {
      expect(controller.create()).to.be.a('function');
    });
  });

  describe('#read', function () {

    it('should return a request handling function', function () {
      expect(controller.read()).to.be.a('function');
    });
  });

  describe('#update', function () {

    it('should return a request handling function', function () {
      expect(controller.update()).to.be.a('function');
    });
  });

  describe('#destroy', function () {

    it('should return a request handling function', function () {
      expect(controller.destroy()).to.be.a('function');
    });
  });
});