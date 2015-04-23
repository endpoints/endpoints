'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

var _expect = require('chai');

var _Application = require('../');

var _Application2 = _interopRequireWildcard(_Application);

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
    TestApp = new _Application2['default']({
      searchPaths: [_path2['default'].resolve(__dirname, 'fixtures/resources'), _path2['default'].resolve(__dirname, 'fixtures/otherResources')],
      routeBuilder: function routeBuilder(routes, prefix) {}
    });
  });

  describe('#register', function () {

    it('should register a resource by name', function () {
      TestApp.register('foo');
      _expect.expect(TestApp.resource('foo')).to.exist;
    });

    it('should be able to register a resource with an object', function () {
      TestApp.register({
        name: 'foo',
        routes: {}
      });
      _expect.expect(TestApp.resource('foo')).to.exist;
    });

    it('should be able to register multiple resources at once', function () {
      var resources = ['foo', { name: 'bar', routes: {} }];
      TestApp.register(resources);
      resources.forEach(function (resource) {
        if (typeof resource !== 'string') {
          resource = resource.name;
        }
        _expect.expect(TestApp.resource(resource)).to.exist;
      });
    });

    it('should throw if a resource with the same name is registered twice', function () {
      var throwMsg = /Resource "foo" registered/;
      TestApp.register('foo');
      _expect.expect(function () {
        TestApp.register('foo');
      }).to['throw'](throwMsg);
      _expect.expect(function () {
        TestApp.register({
          name: 'foo',
          routes: {}
        });
      }).to['throw'](throwMsg);
    });
  });

  describe('#resource', function () {

    it('should throw if the requested resource does not exist', function () {
      var resourceName = 'not-existing';
      var throwMsg = /Resource "not-existing" has not/;
      _expect.expect(function () {
        TestApp.resource(resourceName);
      }).to['throw'](throwMsg);
    });

    it('should return a registered resource', function () {
      TestApp.register('foo');
      _expect.expect(TestApp.resource('foo')).to.exist;
    });

    it('should return this for chaining', function () {
      _expect.expect(TestApp.register('foo')).to.equal(TestApp);
    });
  });

  describe('#endpoint', function () {

    it('should pass the routes for a resource into routeBuilder', function () {
      var fooResource;
      var spy = _sinon2['default'].spy();
      TestApp.routeBuilder = spy;
      TestApp.register('foo').endpoint('foo');
      fooResource = TestApp.resource('foo');
      _expect.expect(spy.calledWith(fooResource.routes, '/' + fooResource.name)).to.be['true'];
    });

    it('should accept a prefix for a generated router', function () {
      var fooResource;
      var spy = _sinon2['default'].spy();
      TestApp.routeBuilder = spy;
      TestApp.register('foo').endpoint('foo', 'prefix');
      fooResource = TestApp.resource('foo');
      _expect.expect(spy.calledWith(fooResource.routes, '/prefix/' + fooResource.name)).to.be['true'];
    });

    it('should add the resource to the endpoints listing', function () {
      TestApp.register('foo').endpoint('foo');
      _expect.expect(TestApp._endpoints).to.have.length(1);
    });
  });

  describe('#manifest', function () {

    it('should build a manifest of endpoints', function () {
      TestApp.register('foo').endpoint('foo', '/prefix');
      TestApp.register('bar').endpoint('bar');
      TestApp.register('baz').endpoint('baz');
      _expect.expect(TestApp.manifest()).to.deep.equal([{
        name: 'foo',
        filters: ['id', 'qux'],
        includes: ['bar', 'baz'],
        url: '/prefix/foo'
      }, {
        name: 'bar',
        filters: ['id', 'qux'],
        includes: [],
        url: '/bar'
      }, {
        name: 'baz',
        filters: [],
        includes: [],
        url: '/baz'
      }]);
    });
  });

  describe('#index', function () {

    it('should build a self-documenting index page', function () {
      TestApp.register('foo').endpoint('foo');
      TestApp.register('bar').endpoint('bar');
      TestApp.register('baz').endpoint('baz');
      _expect.expect(TestApp.index()).to.deep.equal({
        foo: '/foo?include={bar,baz}&filter[{id,qux}]',
        bar: '/bar?filter[{id,qux}]',
        baz: '/baz'
      });
    });
  });
});