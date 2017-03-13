'use strict';

exports.__esModule = true;

exports['default'] = function () {
  var opts = arguments[0] === undefined ? {} : arguments[0];

  if (!opts.routeBuilder) {
    throw new Error('No route builder specified.');
  }
  if (!opts.searchPaths) {
    opts.searchPaths = [];
  } else if (!Array.isArray(opts.searchPaths)) {
    opts.searchPaths = [opts.searchPaths];
  }
  return opts;
};

module.exports = exports['default'];