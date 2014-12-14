module.exports = function (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.source) {
    throw new Error('You must specify a source.');
  }
  if (!opts.params) {
  	opts.params = [];
  }
  return opts;
};
