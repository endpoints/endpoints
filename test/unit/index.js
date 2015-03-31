require('babel/register');

describe('Unit', function () {
  require('../../modules/application/test');
  require('../../modules/controller/test');
  require('../../modules/formatter-jsonapi/test');
  require('../../modules/request-handler/test');
  require('../../modules/response-formatter/test');
  require('../../modules/adapter-bookshelf/test');
  require('../../modules/validate-json-schema/test');
});
