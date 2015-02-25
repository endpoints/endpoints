const expect = require('chai').expect;

const source = require('../mocks/source');

const configureController = require('../../lib/configure_controller');

describe('configureController', function() {

  it('should throw if no method is specified', function () {
    expect(function () {
      configureController();
    }).to.throw(/No method/);
  });

  it('should throw if no source is specified', function () {
    expect(function () {
      configureController('read');
    }).to.throw(/No source/);
  });

  it('should set a sourceMethod property that matches the passed-in method', function() {
    var method = 'read';
    expect(configureController(method, source).sourceMethod).to.equal(method);
  });

  it('should set the method property to opts.method if opts.method exists', function() {
    expect(configureController('read', source, {method:'other'}).method).to.equal('other');
  });

  it('should set the method property to the method argument if opts.method does not exist', function() {
    expect(configureController('read', source).method).to.equal('read');
  });

  it('should set the payload property to a function', function() {
    expect(configureController('read', source).payload).to.be.a('function');
  });

  it('should set the responder property to a function', function() {
    expect(configureController('read', source).responder).to.be.a('function');
  });

  it('should set the type property to a string', function() {
    expect(configureController('read', source).type).to.be.a('string');
  });

  it('should set the controller property to a function', function() {
    expect(configureController('read', source).controller).to.be.a('function');
  });

  it('should set the include property to a array', function() {
    expect(configureController('read', source).include).to.be.an('array');
  });

  it('should set the filter property to an object', function() {
    expect(configureController('read', source).filter).to.be.an('object');
  });

  it('should set the sort property to an array', function() {
    expect(configureController('read', source).sort).to.be.an('array');
  });

});