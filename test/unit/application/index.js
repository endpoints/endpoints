import path from 'path';

import sinon from 'sinon';
import {expect} from 'chai';

import Application from '../../../src/application';
import fooModel from './fixtures/resources/foo/model';

var TestApp;

describe('Application', () => {

  beforeEach(() => {
    TestApp = new Application({
      searchPaths: [
        path.resolve(__dirname, 'fixtures/resources'),
        path.resolve(__dirname, 'fixtures/otherResources')
      ],
      routeBuilder: function (routes, prefix) {}
    });
  });

  describe('constructor', () => {
    it('should throw if a routeBuilder isn\'t provided', () => {
      expect(function () {
        new Application();
      }).to.throw('No route builder specified.');
    });

    it('should ensure that searchPaths is an array', () => {
      expect(new Application({
        routeBuilder: () => {},
      }).searchPaths).to.be.an('array');

      expect(new Application({
        routeBuilder: () => {},
        searchPaths: 'foo'
      }).searchPaths.length).to.equal(1);

      var searchPaths = ['foo', 'bar'];
      expect(new Application({
        routeBuilder: () => {},
        searchPaths: searchPaths
      }).searchPaths).to.equal(searchPaths);
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

  describe('#controllerForModel', () => {
    it('should find a controller that matches the requested model', () => {
      TestApp.register('foo');
      console.log(TestApp.controllerForModel(fooModel));
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
      var spy = sinon.spy();
      TestApp.routeBuilder = spy;
      TestApp.register('foo').endpoint('foo');
      const fooResource = TestApp.resource('foo');
      expect(spy.calledWith(fooResource.routes.map, fooResource.controller.url)).to.be.true;
    });

    it('should add the resource to the endpoints listing', () => {
      TestApp.register('foo').endpoint('foo');
      expect(TestApp._endpoints).to.have.length(1);
    });

  });

  describe('#manifest', () => {

    it('should build a manifest of endpoints', () => {
      TestApp.register('foo').endpoint('foo');
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
          url: '/foo'
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
        foo: '/foo?include={bar,baz}&filter[{id,qux}]',
        bar: '/bar?filter[{id,qux}]',
        baz: '/baz'
      });
    });

  });

});
