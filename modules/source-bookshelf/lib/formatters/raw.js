module.exports = function (data, opts) {
  var singleResult = opts.singleResult;
  return singleResult ? data.first() : data.models;
};
