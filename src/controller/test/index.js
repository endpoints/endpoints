const expect = require('chai').expect;

const Controller = require('../');

const source = require('./mocks/source');

const controller = new Controller({
  adapter: source
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
