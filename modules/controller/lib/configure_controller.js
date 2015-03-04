const _ = require('lodash');

const payloads = {
  create: require('./payloads/create'),
  read: require('./payloads/read'),
  readRelation: require('./payloads/read'),
  update: require('./payloads/update'),
  destroy: require('./payloads/destroy')
};

const sourceInterface = {
  create: require('./source/create'),
  read: require('./source/read'),
  readRelation: require('./source/read_relation'),
  update: require('./source/update'),
  destroy: require('./source/destroy')
};

const responder = require('./responder');

module.exports = function (method, source, opts) {
  var defaults = {
    source: source,
    method: opts && opts.method ? opts.method : method,
    payload: payloads[method],
    sourceInterface: sourceInterface[method],
    responder: responder,
    typeName: source.typeName(),
    include: [],
    filter: {},
    //fields: {},
    sort: []
  };
  var config = _.defaults({}, opts, defaults);

  return config;
};
