const expect = require('chai').expect;
const sinon = require('sinon');

const Controller = require('../');

const typeName = 'mock';
const request = {
  params: {
    id: 1
  },
  query: {
    title: 'foo-bar-baz',
    unSupportedKey: 'something',
    include: 'book,chapter'
  },
  body: {
    mock: {
      key: 'vaulue'
    }
  }
};
const source = {
  typeName: function () { return typeName; },
  create: function() {},
  read: function () {},
  update: function () {},
  destroy: function () {},
  filters: function () {
    return {
      title: true
    };
  },
  relations: function () {
    return ['value'];
  },
  model: {
    create: function () {},
    alternate: function () {}
  }
};

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
    require('./lib/mutating_traverse');
    require('./lib/normalize_value');
    require('./lib/parse_options');
    require('./lib/search_keys');
    require('./lib/uniq');
    require('./lib/responder');

  });

  describe('#filters', function () {

    it('should return an array of valid filters for a request', function () {
      expect(controller.filters(request)).to.deep.equal({
        id: 1,
        title: 'foo-bar-baz'
      });
    });

  });

  describe('#relations', function () {

    it('should return an array of valid relations for a request', function () {
      expect(controller.relations(request)).to.deep.equal(['book', 'chapter']);
    });

  });

  describe('#create', function () {

    it('should throw if user specified creation method does not exist on source model', function () {
      var method = 'badMethod';
      expect(function () {
        controller.create({method:method});
      }).to.throw('Create method "' + method + '" is not present on source\'s model.');
    });

    it('should return a node request handling function', function () {
      expect(controller.create()).to.be.a.function;
    });

    describe('request handler', function () {

      var sourceCreateSpy = sinon.spy(source, 'create');

      beforeEach(function () {
        sourceCreateSpy.reset();
      });

      it('should call #source.create, passing the default "create" method', function () {
        var handler = controller.create();
        handler(request, {});
        expect(sourceCreateSpy.calledWith('create'));
      });

      it('should call #source.create, passing a user specified creation method', function () {
        var method = 'alternate';
        var handler = controller.create({method:method});
        handler(request, {});
        expect(sourceCreateSpy.calledWith(method));
      });

      it('should call #source.create, passing the scoped request body', function () {
        var handler = controller.create();
        var request = { body: {} };
        var scopedBody = request.body[typeName] = { booleanKey: true };
        handler(request, {});
        expect(sourceCreateSpy.calledWith('create', scopedBody));
      });

      // TODO: test calls to the responder in source.create callback
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


      // TODO: test calls to the responder in source.read callback
      // TODO: test calls using pass/raw
    });

  });

  describe('#update', function () {

    it('should return a node request handling function', function () {
      expect(controller.update()).to.be.a.function;
    });

    describe('request handler', function () {

      var sourceUpdateSpy = sinon.spy(source, 'update');

      beforeEach(function () {
        sourceUpdateSpy.reset();
      });

      // TODO: test calls to the responder in source.update callback
    });

  });

  describe('#destroy', function () {

    it('should return a node request handling function', function () {
      expect(controller.destroy()).to.be.a.function;
    });

    describe('request handler', function () {

      var sourceDestroySpy = sinon.spy(source, 'destroy');

      beforeEach(function () {
        sourceDestroySpy.reset();
      });

      // TODO: test calls to the responder in source.update callback
    });

  });

});
