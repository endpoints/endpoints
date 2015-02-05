const extend = require('extend');

const normalizeValue = require('./normalize_value');

var defaults = {
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
  return extend({}, defaults, opts);
};
parseOptions.defaults = defaults;

module.exports = parseOptions;
