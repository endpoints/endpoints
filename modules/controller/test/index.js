const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

const Controller = require('../');

const source = require('./mocks/source');
const controller = new Controller({
  source: source
});

describe('Controller', function () {

  it('should be an object', function() {
    expect(controller).to.be.an('object');
  });

  describe('constructor', function () {

    it('should throw if no source is specified', function () {
      expect(function () {
        new Controller();
      }).to.throw('No source specified.');
    });

  });

  describe('lib', function () {

    require('./lib/configure');
    require('./lib/source_has');
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
