const path = require('path');

const sinon = require('sinon');
const expect = require('chai').expect;

const Application = require('../');

var TestApp;

describe('Application', () => {

  describe('lib', () => {

    require('./lib/parse_options');
    require('./lib/parse_resource');
    require('./lib/require_search');
    require('./lib/require_silent');
    require('./lib/slash_wrap');

  });

  beforeEach(() => {
    TestApp = new Application({
      searchPaths: [
        path.resolve(__dirname, 'fixtures/resources'),
        path.resolve(__dirname, 'fixtures/otherResources')
      ],
      routeBuilder: function (routes, prefix) {}
    });
  });

  describe('#register', () => {

    it('should register a resource by name', () => {
      TestApp.register('foo');
      expect(TestApp.resource('foo')).to.exist;
    });

    it('should be able to register a resource with an object', () => {
      TestApp.register({
        name: 'foo',
        routes: {}
      });
      expect(TestApp.resource('foo')).to.exist;
    });

    it('should be able to register multiple resources at once', () => {
      var resources = ['foo', {name:'bar', routes:{}}];
      TestApp.register(resources);
      resources.forEach(function (resource) {
        if (typeof resource !== 'string') {
          resource = resource.name;
        }
        expect(TestApp.resource(resource)).to.exist;
      });
    });

    it('should throw if a resource with the same name is registered twice', () => {
      var throwMsg = /Resource "foo" registered/;
      TestApp.register('foo');
      expect(() => {
        TestApp.register('foo');
      }).to.throw(throwMsg);
      expect(() => {
        TestApp.register({
          name: 'foo',
          routes: {}
        });
      }).to.throw(throwMsg);
    });

  });

  describe('#resource', () => {

    it('should throw if the requested resource does not exist', () => {
      var resourceName = 'not-existing';
      var throwMsg = /Resource "not-existing" has not/;
      expect(() => {
        TestApp.resource(resourceName);
      }).to.throw(throwMsg);
    });

    it('should return a registered resource', () => {
      TestApp.register('foo');
      expect(TestApp.resource('foo')).to.exist;
    });

    it('should return this for chaining', () => {
      expect(TestApp.register('foo')).to.equal(TestApp);
    });

  });

  describe('#endpoint', () => {

    it('should pass the routes for a resource into routeBuilder', () => {
      var fooResource;
      var spy = sinon.spy();
      TestApp.routeBuilder = spy;
      TestApp.register('foo').endpoint('foo');
      fooResource = TestApp.resource('foo');
      expect(spy.calledWith(fooResource.routes, '/' + fooResource.name)).to.be.true;
    });

    it('should accept a prefix for a generated router', () => {
      var fooResource;
      var spy = sinon.spy();
      TestApp.routeBuilder = spy;
      TestApp.register('foo').endpoint('foo', 'prefix');
      fooResource = TestApp.resource('foo');
      expect(spy.calledWith(fooResource.routes, '/prefix/' + fooResource.name)).to.be.true;
    });

    it('should add the resource to the endpoints listing', () => {
      TestApp.register('foo').endpoint('foo');
      expect(TestApp._endpoints).to.have.length(1);
    });

  });

  describe('#manifest', () => {

    it('should build a manifest of endpoints', () => {
      TestApp.register('foo').endpoint('foo', '/prefix');
      TestApp.register('bar').endpoint('bar');
      TestApp.register('baz').endpoint('baz');
      expect(TestApp.manifest()).to.deep.equal([
        {
          name: 'foo',
          filters: [
            'id',
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
          filters: [
            'id',
            'qux'
          ],
          includes: [],
          url: '/bar'
        },
        {
          name: 'baz',
          filters: [],
          includes: [],
          url: '/baz'
        }
      ]);
    });

  });

  describe('#index', () => {

    it('should build a self-documenting index page', () => {
      TestApp.register('foo').endpoint('foo');
      TestApp.register('bar').endpoint('bar');
      TestApp.register('baz').endpoint('baz');
      expect(TestApp.index()).to.deep.equal({
        foo: '/foo?include={bar,baz}&{id,qux}',
        bar: '/bar?{id,qux}',
        baz: '/baz'
      });
    });

  });

});
