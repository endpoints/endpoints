/*import {expect} from 'chai';

import Controller from '../';

import adapter from './mocks/adapter';
import model from './mocks/model';

const controller = new Controller({
  adapter: adapter,
  model: model
});

describe('Controller', () => {

  describe('lib', () => {

    require('./lib/single_slash_join');

  });

  it('should be an object', () => {
    expect(controller).to.be.an('object');
  });

  describe('constructor', () => {

    it('should throw if no adapter is specified', () => {
      expect(() => {
        new Controller();
      }).to.throw('No adapter specified.');
    });

    it('should throw if no model is specified', () => {
      expect(() => {
        new Controller({
          adapter: adapter
        });
      }).to.throw('No model specified.');
    });

  });

  describe('extending', () => {

    it('should be extendable in es5', () => {
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
      expect(myController.config.allowClientGeneratedIds).to.be.true;
      expect(myController.config.validators).to.equal(validators);
    });

  });

  describe('lib', () => {

    require('./lib/adapter_has');
    require('./lib/validate');

  });

  describe('#create', () => {

    it('should return a request handling function', () => {
      expect(controller.create()).to.be.a('function');
    });

  });

  describe('#read', () => {

    it('should return a request handling function', () => {
      expect(controller.read()).to.be.a('function');
    });

  });

  describe('#update', () => {

    it('should return a request handling function', () => {
      expect(controller.update()).to.be.a('function');
    });

  });

  describe('#destroy', () => {

    it('should return a request handling function', () => {
      expect(controller.destroy()).to.be.a('function');
    });

  });

});
*/
