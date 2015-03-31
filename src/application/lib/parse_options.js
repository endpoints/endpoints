module.exports = function (opts={}) {
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
