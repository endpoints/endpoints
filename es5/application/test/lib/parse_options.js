'use strict';

var expect = require('chai').expect;

var parseOptions = require('../../lib/parse_options');

describe('parseOptions', function () {

  it('should throw if a routeBuilder isn\'t provided', function () {
    expect(function () {
      parseOptions();
    }).to['throw']('No route builder specified.');
  });

  it('should ensure that searchPaths is an array', function () {
    expect(parseOptions({
      routeBuilder: function routeBuilder() {} }).searchPaths).to.be.an('array');

    expect(parseOptions({
      routeBuilder: function routeBuilder() {},
      searchPaths: 'foo'
    }).searchPaths.length).to.equal(1);

    var searchPaths = ['foo', 'bar'];
    expect(parseOptions({
      routeBuilder: function routeBuilder() {},
      searchPaths: searchPaths
    }).searchPaths).to.equal(searchPaths);
  });
});