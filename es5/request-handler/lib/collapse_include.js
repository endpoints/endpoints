'use strict';

exports.__esModule = true;

exports['default'] = function (includes) {
  var memo = {};
  return includes.map(function (include) {
    return include.split('.');
  }).sort(function (a, b) {
    return b.length - a.length;
  }).reduce(function (result, parts) {
    var item = undefined;
    var i = parts.length + 1;
    while (--i) {
      item = parts.slice(0, i).join('.');
      if (!memo[item]) {
        memo[item] = true;
        if (i === parts.length) {
          result.push(item);
        }
      }
    }
    return result;
  }, []);
};

module.exports = exports['default'];