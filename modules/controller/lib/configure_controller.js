const _ = require('lodash');

const responder = require('./responder');

module.exports = function (method, source, opts) {
  var defaults = {
    source: source,
    method: opts && opts.method ? opts.method : method,
    responder: responder,
    typeName: source.typeName(),
    include: [],
    filter: {},
    fields: {},
    sort: []
  };
  var config = _.defaults({}, opts, defaults);

  return config;
};
