const _ = require('lodash');

module.exports = function(obj) {
  return _.transform(obj, function(result, n, key) {
    result[key] = String(n).split(',');
  });
};
