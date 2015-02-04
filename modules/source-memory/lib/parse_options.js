module.exports = function (opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.model) {
    throw new Error('No memory model specified.');
  }
  if (!opts.allowedRelations) {

  }
  return opts;
};
