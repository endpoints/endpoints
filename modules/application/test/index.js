const path = require('path');

const sinon = require('sinon');
const expect = require('chai').expect;

const Application = require('../');

var TestApp;

describe('Application', function () {

  describe('lib', function () {
    require('./lib/parse_options');
    require('./lib/parse_resource');
    require('./lib/require_search');
    require('./lib/require_silent');
    require('./lib/slash_wrap');
  });

  beforeEach(function () {
    TestApp = new Application({
      searchPaths: [
        path.resolve(__dirname, 'fixtures/resources'),
        path.resolve(__dirname, 'fixtures/otherResources')
      ],
      routeBuilder: function (routes, prefix) {}
    });
  });

  describe('#register', function () {
    it('should register a resource by name', function () {
      TestApp.register('foo');
      expect(TestApp.resource('foo')).to.exist;
    });

    it('should be able to register a resource with an object', function () {
      TestApp.register({
        name: 'foo',
        routes: {}
      });
      expect(TestApp.resource('foo')).to.exist;
    });

    it('should be able to register multiple resources at once', function () {
      var resources = ['foo', {name:'bar', routes:{}}];
      TestApp.register(resources);
      resources.forEach(function (resource) {
        if (typeof resource !== 'string') {
          resource = resource.name;
        }
        expect(TestApp.resource(resource)).to.exist;
      });
    });

    it('should throw if a resource with the same name is registered twice', function () {
      var throwMsg = 'Resource "foo" has already been registered.';
      TestApp.register('foo');
      expect(function () {
        TestApp.register('foo');
      }).to.throw(throwMsg);
      expect(function () {
        TestApp.register({
          name: 'foo',
          routes: {}
        });
      }).to.throw(throwMsg);
    });

  });

  describe('#resource', function () {
    it('should throw if the requested resource does not exist', function () {
      var resourceName = 'not-existing';
      expect(function () {
        TestApp.resource(resourceName);
      }).to.throw('Resource ' + resourceName + ' has not been registered.');
    });

    it('should return a registered resource', function () {
      TestApp.register('foo');
      expect(TestApp.resource('foo')).to.exist;
    });

    it('should return this for chaining', function () {
      expect(TestApp.register('foo')).to.equal(TestApp);
    });
  });

  describe('#endpoint', function () {
    it('should pass the routes for a resource into routeBuilder', function () {
      var fooResource;
      var spy = sinon.spy();
      TestApp.routeBuilder = spy;
      TestApp.register('foo').endpoint('foo');
      fooResource = TestApp.resource('foo');
      expect(spy.calledWith(fooResource.routes, '/' + fooResource.name)).to.be.true;
    });

    it('should accept a prefix for a generated router', function () {
      var fooResource;
      var spy = sinon.spy();
      TestApp.routeBuilder = spy;
      TestApp.register('foo').endpoint('foo', 'prefix');
      fooResource = TestApp.resource('foo');
      expect(spy.calledWith(fooResource.routes, '/prefix/' + fooResource.name)).to.be.true;
    });

    it('should add the resource to the endpoints listing', function () {
      TestApp.register('foo').endpoint('foo');
      expect(TestApp._endpoints).to.have.length(1);
    });
  });

  describe('#manifest', function () {
    it('should build a manifest of endpoints', function () {
      TestApp.register('foo').endpoint('foo', '/prefix');
      TestApp.register('bar').endpoint('bar');
      expect(TestApp.manifest()).to.deep.equal([
        {
          name: 'foo',
          filters: [
            'qux'
          ],
          includes: [
            'bar',
            'baz'
          ],
          url: '/prefix/foo'
        },
        {
          name: 'bar',
          filters: [],
          includes: [],
          url: '/bar'
        }
      ]);
    });
  });

  describe('#index', function () {
    it('should build a self-documenting index page', function () {
      TestApp.register('foo').endpoint('foo');
      TestApp.register('bar').endpoint('bar');
      expect(TestApp.index()).to.deep.equal({
        foo: '/foo?include={bar,baz}&{qux}',
        bar: '/bar'
      });
    });
  });

});
