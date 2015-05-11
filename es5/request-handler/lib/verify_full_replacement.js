'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

exports['default'] = function (request, endpoint) {
  var err;
  var data = request.body.data;
  var mode = endpoint.mode(request);

  function hasToManyLinkage(object) {
    var has = false;
    _lodash2['default'].forIn(object.links, function (val, key) {
      if (Array.isArray(val.linkage)) {
        has = true;
      }
    });
    return has;
  }

  // relation mode, to-Many relations appear as an array
  if (mode === 'relation') {
    err = Array.isArray(data);
  } else if (Array.isArray(data)) {
    err = _lodash2['default'].reduce(data, function (result, resource) {
      return result || hasToManyLinkage(resource);
    }, false);
  } else {
    err = hasToManyLinkage(data);
  }

  return err ? _kapow2['default'](403, 'Full replacement of to-Many relations is not allowed.') : null;
};

module.exports = exports['default'];