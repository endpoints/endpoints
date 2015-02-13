const expect = require('chai').expect;

const jsonApi = require('../');

describe('jsonApi', function () {

  describe('lib', function () {
    require('./lib/get_key');
    require('./lib/link');
    require('./lib/relate');
    require('./lib/to_one_relations');
    require('./lib/format_model');
  });

  describe('module', function () {
    expect(jsonApi).to.equal(jsonApi);
  });

});
