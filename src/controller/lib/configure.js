const _ = require('lodash');

module.exports = function (method, opts={}) {
  var defaults = {
    method: opts.method ? opts.method : method,
    include: [],
    filter: {},
    fields: {},
    sort: [],
    schema: {},
    validators: []
  };
  var config = _.defaults({}, opts, defaults);

  return config;
};
