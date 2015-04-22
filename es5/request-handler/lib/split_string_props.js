'use strict';

var _ = require('lodash');

module.exports = function (obj) {
  return _.transform(obj, function (result, n, key) {
    var val = String(n);
    result[key] = val.indexOf(',') === -1 ? val : val.split(',');
  });
};