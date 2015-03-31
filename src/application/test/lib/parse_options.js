const expect = require('chai').expect;

const parseOptions = require('../../lib/parse_options');

describe('parseOptions', () => {

  it('should throw if a routeBuilder isn\'t provided', () => {
    expect(function () {
      parseOptions();
    }).to.throw('No route builder specified.');
  });

  it('should ensure that searchPaths is an array', () => {
    expect(parseOptions({
      routeBuilder: () => {},
    }).searchPaths).to.be.an('array');

    expect(parseOptions({
      routeBuilder: () => {},
      searchPaths: 'foo'
    }).searchPaths.length).to.equal(1);

    var searchPaths = ['foo', 'bar'];
    expect(parseOptions({
      routeBuilder: () => {},
      searchPaths: searchPaths
    }).searchPaths).to.equal(searchPaths);
  });

});
