import {expect} from 'chai';

import Resource from '../../../src/resource';

describe('Resource', () => {

  describe('lib', () => {

    require('./lib/create_from_fs');
    require('./lib/require_search');
    require('./lib/require_silent');

  });

  describe('constructor', () => {

    it('should throw if a name isn\'t provided', () => {
      expect(function () {
        new Resource();
      }).to.throw('Resource must have a name.');
    });

    it('should throw if routes aren\'t provided', () => {
      expect(function () {
        new Resource({name:'test'});
      }).to.throw('Resource must have routes.');
    });

  });

});
