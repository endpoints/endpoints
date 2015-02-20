const _ = require('lodash');
const sinon = require('sinon');

module.exports = function (obj) {
  return _.extend({
    accepts: sinon.stub().returns(false),
    headers: {
      'accept': 'application/vnd.api+json',
      'content-type': 'application/vnd.api+json'
    }
  }, obj);
};
