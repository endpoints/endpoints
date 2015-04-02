const expect = require('chai').expect;

const Controller = require('../');

const adapter = require('./mocks/adapter');
const model = require('./mocks/model');

const controller = new Controller({
  adapter: adapter,
  model: model
});


describe('Controller', () => {

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
        validators: validators
      });
      var myController = new MyController({
        model: require('./mocks/model')
      });
      expect(myController.adapter).to.equal(adapter);
      expect(myController.validators).to.equal(validators);
    });

    it('should be extendable in es6', () => {
      var adapter = require('./mocks/adapter');
      var validators = ['validators'];

      class MyController extends Controller {
        get adapter() {
          return adapter;
        }
        get validators() {
          return validators;
        }
      }
      var myController = new MyController({
        model: require('./mocks/model')
      });
      expect(myController.adapter).to.equal(adapter);
      expect(myController.validators).to.equal(validators);
    });

  });

  describe('lib', () => {

    require('./lib/configure');
    require('./lib/source_has');
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
