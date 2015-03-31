require('babel/register');

describe('Unit', function () {
  require('../../src/application/test');
  require('../../src/controller/test');
  require('../../src/formatter-jsonapi/test');
  require('../../src/request-handler/test');
  require('../../src/response-formatter/test');
  require('../../src/adapter-bookshelf/test');
  require('../../src/validate-json-schema/test');
});
