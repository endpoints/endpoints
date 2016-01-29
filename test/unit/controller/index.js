import {expect} from 'chai';

import Controller from '../../../src/controller';

describe('Controller', () => {

  describe('lib', () => {

    require('./lib/handle');
    require('./lib/model_has');
    require('./lib/send');
    require('./lib/single_slash_join');
    require('./lib/validate');

  });

  describe('constructor', () => {

    it('should throw if no format is specified', () => {
      expect(() => {
        new Controller();
      }).to.throw('No format specified.');
    });

    it('should throw if no store is specified', () => {
      expect(() => {
        new Controller({
          format: true,
        });
      }).to.throw('No store specified.');
    });

    it('should throw if no model is specified', () => {
      expect(() => {
        new Controller({
          format: true,
          store: true,
        });
      }).to.throw('No model specified.');
    });

    it('should throw if no baseUrl is specified', () => {
      expect(() => {
        new Controller({
          format: true,
          store: true,
          model: true,
        });
      }).to.throw('No baseUrl specified for URL generation.');
    });

    it('should throw if no basePath is specified', () => {
      expect(() => {
        new Controller({
          format: true,
          store: true,
          model: true,
          baseUrl: true
        });
      }).to.throw('No basePath specified for URL generation.');
    });

    it('should not throw if all config is specified', () => {
      expect(() => {
        new Controller({
          format: true,
          store: true,
          model: true,
          baseUrl: true,
          basePath: true
        });
      }).to.not.throw;
    });

  });

  describe('extending', () => {

    it('should be extendable in es5', () => {
      const store = require('./mocks/store');
      const validators = ['validators'];

      const MyController = Controller.extend({
        store: store,
        validators: validators,
        allowClientGeneratedIds: true
      });
      const myController = new MyController({
        format: true,
        model: true,
        baseUrl: true,
        basePath: true
      });
      expect(myController.config.store).to.equal(store);
      expect(myController.config.allowClientGeneratedIds).to.be.true;
      expect(myController.config.validators).to.equal(validators);
    });

  });

  let Store;
  let controller;

  beforeEach(() => {
    Store = require('./mocks/store');
    const Model = require('./mocks/model');
    controller = new Controller({
      format() {},
      store: new Store(Model),
      model: true,
      baseUrl: true,
      basePath: true
    });

  });

  describe('#create', () => {

    it('should return a request handling function', () => {
      expect(controller.create()).to.be.a('function');
    });

  });

  describe('#createRelation', () => {

    it('should return a request handling function', () => {
      expect(controller.createRelation()).to.be.a('function');
    });

  });

  describe('#read', () => {

    it('should return a request handling function', () => {
      expect(controller.read()).to.be.a('function');
    });

  });

  describe('#readRelated', () => {

    it('should return a request handling function', () => {
      expect(controller.readRelated()).to.be.a('function');
    });

  });

  describe('#readRelation', () => {

    it('should return a request handling function', () => {
      expect(controller.readRelation()).to.be.a('function');
    });

  });

  describe('#update', () => {

    it('should return a request handling function', () => {
      expect(controller.update()).to.be.a('function');
    });

  });

  describe('#updateRelation', () => {

    it('should return a request handling function', () => {
      expect(controller.updateRelation()).to.be.a('function');
    });

  });

  describe('#destroy', () => {

    it('should return a request handling function', () => {
      expect(controller.destroy()).to.be.a('function');
    });

  });

  describe('#destroyRelation', () => {

    it('should return a request handling function', () => {
      expect(controller.destroyRelation()).to.be.a('function');
    });

  });

  describe('#capabilities', () => {

    it('should return an object', () => {
      expect(controller.capabilities).to.be.a('object');
    });

  });

});
