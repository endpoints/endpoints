const expect = require('chai').expect;
const sinon = require('sinon');

const Controller = require('../');

const source = require('./mocks/source');
const controller = new Controller({
  source: source
});

describe('Controller', function () {

  describe('lib', function () {

    describe('responders', function () {

      require('./lib/responders/create');
      require('./lib/responders/destroy');
      require('./lib/responders/read');
      require('./lib/responders/update');

    });

    require('./lib/extract');
    require('./lib/normalize_value');
    require('./lib/parse_options');
    require('./lib/search_keys');
    require('./lib/responder');

  });

  describe('#create', function () {

    it('should throw if user specified creation method does not exist on source model', function () {
      expect(function () {
        controller.create({method:'badMethod'});
      }).to.throw(/Create method/);
    });

    it('should return a node request handling function', function () {
      expect(controller.create()).to.be.a.function;
    });

    describe('request handler', function () {

      var sourceCreateSpy = sinon.spy(source, 'create');

      beforeEach(function () {
        sourceCreateSpy.reset();
      });

      // TODO: test this at all?

    });

  });

  describe('#read', function () {

    it('should return a node request handling function', function () {
      expect(controller.read()).to.be.a.function;
    });

    describe('request handler', function () {

      var sourceReadSpy = sinon.spy(source, 'read');

      beforeEach(function () {
        sourceReadSpy.reset();
      });

      // TODO: test this at all?

    });

  });

  describe('#update', function () {

    it('should throw if user specified update method does not exist on source model prototype', function () {
      expect(function () {
        controller.update({method:'badMethod'});
      }).to.throw(/Update method/);
    });

    it('should return a node request handling function', function () {
      expect(controller.update()).to.be.a.function;
    });

    describe('request handler', function () {

      var sourceUpdateSpy = sinon.spy(source, 'update');

      beforeEach(function () {
        sourceUpdateSpy.reset();
      });

      // TODO: test this at all?

    });

  });

  describe('#destroy', function () {

    it('should throw if user specified destroy method does not exist on source model prototype', function () {
      expect(function () {
        controller.destroy({method:'badMethod'});
      }).to.throw(/Destroy method/);
    });

    it('should return a node request handling function', function () {
      expect(controller.destroy()).to.be.a.function;
    });

    describe('request handler', function () {

      var sourceDestroySpy = sinon.spy(source, 'destroy');

      beforeEach(function () {
        sourceDestroySpy.reset();
      });

      // TODO: test this at all?

    });

  });

});
