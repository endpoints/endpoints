const path = require('path');

const expect = require('chai').expect;

const parseResource = require('../../lib/parse_resource');

describe('parseResource', function () {

  it('should find a routes file in search paths and return a resource object', function () {
    var searchPaths = [path.join(__dirname, '..', 'fixtures', 'resources')];
    expect(parseResource('foo', searchPaths)).to.deep.equal({
      name: 'foo',
      routes: require('../fixtures/resources/foo/routes'),
      controller: require('../fixtures/resources/foo/controller')
    });
  });

  it('should throw if a custom resource is defined without a name', function () {
    expect(function () {
      parseResource();
    }).to.throw('Unable to parse a module without a name.');
    expect(function () {
      parseResource({});
    }).to.throw('Unable to parse a module without a name.');
  });

  it('should throw if a custom resource is defined without a routes object', function () {
    expect(function () {
      parseResource({name:'test'});
    }).to.throw('Unable to parse a module without a routes object.');
  });

  it('should pass custom module through', function () {
    var moduleDefinition = {
      name: 'test',
      routes: {
        get: {
          '/': function (request, response) {
            response.send(200);
          }
        }
      }
    };
    expect(parseResource(moduleDefinition)).to.deep.equal(moduleDefinition);
  });

});
