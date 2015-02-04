const expect = require('chai').expect;

const jsonApi = require('../');

describe('jsonApi', function () {

  describe('lib', function () {
    require('./lib/get_key');
    require('./lib/link_belongs_to');
    require('./lib/link');
    require('./lib/relate');
  });

  describe('module', function () {
    expect(jsonApi).to.equal(jsonApi);
  });

});
