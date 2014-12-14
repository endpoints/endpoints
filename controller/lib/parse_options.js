module.exports = function (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.model) {
    throw new Error('You must specify a model.');
  }
  return opts;
};
