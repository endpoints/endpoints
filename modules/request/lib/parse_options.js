const extend = require('extend');

const normalizeValue = require('./normalize_value');

var defaults = {
  allowedFilters: [],
  relationKey: 'include',
  requestKeysToSearch: ['params', 'body', 'query'],
  paramNormalizer: normalizeValue
};

var parseOptions = function (opts) {
  if (!opts) {
    opts = {};
  }
  var source = opts.source;
  if (!source) {
    throw new Error('No source specified.');
  }
  if (!opts.allowedFilters) {
    opts.allowedFilters = Object.keys(source.filters());
  }
  if (opts.allowedFilters && !Array.isArray(opts.allowedFilters)) {
    throw new Error('Allowed filters must be an array.');
  }
  return extend({}, defaults, opts);
};
parseOptions.defaults = defaults;

module.exports = parseOptions;
