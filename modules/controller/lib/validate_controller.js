const _ = require('lodash');

const sourceHas = require('./source_has');

module.exports = function (source, config) {
  var method = config.sourceMethod;
  return _.compose(_.flatten, _.compact)([
    sourceHas(source.relations(), config.include, 'relations'),
    sourceHas(source.filters(), Object.keys(config.filter), 'filters'),
    // this is crap
    (method === 'read' || method === 'readRelation') ? null :
      sourceHas(
        method === 'create' ? source.model : source.model.prototype,
        config.method,
        'method'
      )
  ]);
};
