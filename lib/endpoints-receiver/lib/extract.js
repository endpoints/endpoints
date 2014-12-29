const searchKeys = require('./search_keys');

module.exports = function (opts) {
  if (!opts) {
    opts = {};
  }
  // the object holding our values
  var context = opts.context;
  // the keys we want to find
  var find = opts.find;
  // the places inside the context object we'll try to find values in
  var contextKeysToSearch = opts.contextKeysToSearch;
  // a method to process
  var normalizer = opts.normalizer;

  if (!context) {
    throw new Error('No context specified to read values from.');
  }
  if (!find) {
    throw new Error('No keys specified to find in context.');
  }
  if (!contextKeysToSearch) {
    throw new Error('No context keys specified to find values in.');
  }
  if (normalizer && typeof normalizer !== 'function') {
    throw new Error('Invalid normalizing function.');
  }
  var lookup = searchKeys.bind(null, context, contextKeysToSearch);
  var findAsArray = Array.isArray(find) ? find : [find];
  var result = findAsArray.reduce(function (result, param) {
    var value = lookup(param);
    if (value) {
      result[param] = normalizer ? normalizer(value) : value;
    }
    return result;
  }, {});
  return Array.isArray(find) ? result : result[find];
};
