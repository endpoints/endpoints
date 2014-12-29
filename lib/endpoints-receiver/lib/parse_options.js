const extend = require('extend');

const normalizeValue = require('./normalize_value');

var defaults = {
  allowedFilters: [],
  allowedRelations: [],
  relationKey: 'withRelated',
  requestKeysToSearch: ['params', 'body', 'query'],
  paramNormalizer: normalizeValue
};

var parseOptions = function (opts) {
  if (!opts) {
    opts = {};
  }
  if (opts.allowedFilters && !Array.isArray(opts.allowedFilters)) {
    throw new Error('Allowed filters must be an array.');
  }
  if (opts.allowedRelations && !Array.isArray(opts.allowedRelations)) {
    throw new Error('Allowed relations must be an array.');
  }
  return extend({}, defaults, opts);
};
parseOptions.defaults = defaults;

module.exports = parseOptions;
