import path from 'path';
import {expect} from 'chai';

import createFromFS from '../../../../src/resource/lib/create_from_fs';

describe('createFromFS', () => {

  it('should find a routes file in search paths and return a resource object', () => {
    var searchPaths = [path.join(__dirname, '..', 'fixtures', 'resources')];
    expect(createFromFS('foo', searchPaths)).to.deep.equal({
      name: 'foo',
      routes: require('../fixtures/resources/foo/routes'),
      controller: require('../fixtures/resources/foo/controller')
    });
  });

  it('should throw if a custom resource is defined without a name', () => {
    expect(() => {
      createFromFS();
    }).to.throw('Unable to parse a module without a name.');
    expect(() => {
      createFromFS({});
    }).to.throw('Unable to parse a module without a name.');
  });

  it('should throw if a custom resource is defined without a routes object', () => {
    expect(() => {
      createFromFS({name:'test'});
    }).to.throw('Unable to parse a module without a routes object.');
  });

  it('should pass custom module through', () => {
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
    expect(createFromFS(moduleDefinition)).to.deep.equal(moduleDefinition);
  });

});
