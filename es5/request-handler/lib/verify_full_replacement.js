'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

exports['default'] = function (request, endpoint) {
  var err;
  var data = request.body.data;
  var mode = endpoint.mode(request);

  function hasToManyLinkage(object) {
    var has = false;
    _import2['default'].forIn(object.links, function (val, key) {
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
    err = _import2['default'].reduce(data, function (result, resource) {
      return result || hasToManyLinkage(resource);
    }, false);
  } else {
    err = hasToManyLinkage(data);
  }

  return err ? _Kapow2['default'](403, 'Full replacement of to-Many relations is not allowed.') : null;
};

module.exports = exports['default'];