const extend = require('extend');

var parseOptions = function (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.source) {
    throw new Error('No source specified.');
  }
  if (!opts.receiver) {
    throw new Error('No receiver specified.');
  }
  return opts;
};

module.exports = parseOptions;
