const _ = require('lodash');

var defaults = {
  includeKey: 'include',
  filterKey: 'filter',
  fieldsKey: 'fields',
  sortKey: 'sort'
};

var parseOptions = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = opts.source;
  if (!source) {
    throw new Error('No source specified.');
  }
  return _.extend({}, defaults, opts);
};
parseOptions.defaults = defaults;

module.exports = parseOptions;
