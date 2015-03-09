const _ = require('lodash');

module.exports = function (method, source, opts) {
  var defaults = {
    source: source,
    method: opts && opts.method ? opts.method : method,
    typeName: source.typeName(),
    include: [],
    filter: {},
    fields: {},
    sort: []
  };
  var config = _.defaults({}, opts, defaults);

  return config;
};
