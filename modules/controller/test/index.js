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

    describe('payloads', function () {

      require('./lib/payloads/create');
      require('./lib/payloads/destroy');
      require('./lib/payloads/read');
      require('./lib/payloads/update');

    });

    describe('source interface', function () {

      require('./lib/source/create');
      require('./lib/source/destroy');
      require('./lib/source/read');
      require('./lib/source/read_relation');
      require('./lib/source/update');

    });

    require('./lib/configure_controller');
    require('./lib/get_params');
    require('./lib/request_handler');
    require('./lib/responder');
    require('./lib/source_has');
    require('./lib/throw_if_model');
    require('./lib/throw_if_no_model');
    require('./lib/validate_controller');
    require('./lib/verify_accept');
    require('./lib/verify_content_type');
    require('./lib/verify_data_object');

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

  describe('#readRelation', function () {

    it('should return a request handling function', function () {
      expect(controller.readRelation()).to.be.a('function');
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
