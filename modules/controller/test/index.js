const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-as-promised'));

const Controller = require('../');

const source = require('./mocks/source');
const controller = new Controller({
  source: source
});

describe('Controller', function () {

  describe('lib', function () {

    describe('payloads', function () {

      require('./lib/payloads/create');
      require('./lib/payloads/destroy');
      require('./lib/payloads/read');
      require('./lib/payloads/update');

    });

    require('./lib/parse_options');
    require('./lib/request_handler');
    require('./lib/responder');
    require('./lib/source_has');
    require('./lib/verify_accept');
    require('./lib/verify_content_type');

  });

  describe('#create', function () {

    it('should throw if user specified creation method does not exist on source model', function () {
      expect(function () {
        controller.create({method:'badMethod'});
      }).to.throw(/Model does not have/);
    });

    it('should return a node request handling function', function () {
      expect(controller.create()).to.be.a.function;
    });

  });

  describe('#read', function () {

    it('should throw if user specified includes do not exist on the source', function () {
      expect(function () {
        controller.read({include:['badRelation']});
      }).to.throw(/Model does not have/);
    });

    it('should throw if user specified filters do not exist on the source', function () {
      expect(function () {
        controller.read({
          filter: {
            badFilter: 'value'
          }
        });
      }).to.throw(/Model does not have/);
    });

    it('should return a node request handling function', function () {
      expect(controller.read()).to.be.a.function;
    });

  });

  describe('#readRelation', function() {

    it('should throw if user specified model that does not exist', function() {
      return expect(
        controller._readRelation(null, {params:{id:'badId'}})
      ).to.be.rejectedWith(/Unable to locate/);
    });

    it('should return a node request handling function', function () {
      expect(controller.readRelation()).to.be.a.function;
    });

  });

  describe('#update', function () {

    it('should throw if user specified update method does not exist on source', function () {
      expect(function () {
        controller.update({method:'badMethod'});
      }).to.throw(/Model does not have/);
    });

    it('should throw if user specified model that does not exist', function() {
      return expect(
        controller._readRelation(null, {params:{id:'badId'}})
      ).to.be.rejectedWith(/Unable to locate/);
    });

    it('should return a node request handling function', function () {
      expect(controller.update()).to.be.a.function;
    });

  });

  describe('#destroy', function () {

    it('should throw if user specified destroy method does not exist on source model prototype', function () {
      expect(function () {
        controller.destroy({method:'badMethod'});
      }).to.throw(/Model does not have/);
    });

    it('should throw if user specified model that does not exist', function() {
      return expect(
        controller._readRelation(null, {params:{id:'badId'}})
      ).to.be.rejectedWith(/Unable to locate/);
    });

    it('should return a node request handling function', function () {
      expect(controller.destroy()).to.be.a.function;
    });
  });

});
