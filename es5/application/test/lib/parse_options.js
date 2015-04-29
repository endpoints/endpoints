'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _parseOptions = require('../../lib/parse_options');

var _parseOptions2 = _interopRequireDefault(_parseOptions);

describe('parseOptions', function () {

  it('should throw if a routeBuilder isn\'t provided', function () {
    _expect.expect(function () {
      _parseOptions2['default']();
    }).to['throw']('No route builder specified.');
  });

  it('should ensure that searchPaths is an array', function () {
    _expect.expect(_parseOptions2['default']({
      routeBuilder: function routeBuilder() {} }).searchPaths).to.be.an('array');

    _expect.expect(_parseOptions2['default']({
      routeBuilder: function routeBuilder() {},
      searchPaths: 'foo'
    }).searchPaths.length).to.equal(1);

    var searchPaths = ['foo', 'bar'];
    _expect.expect(_parseOptions2['default']({
      routeBuilder: function routeBuilder() {},
      searchPaths: searchPaths
    }).searchPaths).to.equal(searchPaths);
  });
});