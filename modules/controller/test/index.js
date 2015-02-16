const expect = require('chai').expect;

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

  describe('#validFilters', function () {

    it('should return an array of requested filters which are valid on the source', function () {
      expect(controller.validFilters([])).to.deep.equal([]);
      expect(controller.validFilters(['cat', 'dog'])).to.deep.equal([]);
      expect(controller.validFilters(['title', 'dog'])).to.deep.equal(['title']);
    });

  });

  describe('#validRelations', function () {

    it('should return an array of requested relations which are valid on the source', function () {
      expect(controller.validRelations([])).to.deep.equal([]);
      expect(controller.validRelations(['cat', 'dog'])).to.deep.equal([]);
      expect(controller.validRelations(['relation', 'dog'])).to.deep.equal(['relation']);
    });

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

  });

  describe('#read', function () {

    it('should throw if user specified includes do not exist on the source', function () {
      expect(function () {
        controller.read({include:['badRelation']});
      }).to.throw(/Model does not have/);
    });

    it('should throw if user specified filters do not exist on the source', function () {
      expect(function () {
        controller.read({filters:['badFilter']});
      }).to.throw(/Model does not have/);
    });

    it('should return a node request handling function', function () {
      expect(controller.read()).to.be.a.function;
    });

  });

  describe('#update', function () {

    it('should throw if user specified update method does not exist on source', function () {
      expect(function () {
        controller.update({method:'badMethod'});
      }).to.throw(/Update method/);
    });

    it('should return a node request handling function', function () {
      expect(controller.update()).to.be.a.function;
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

  });

});
