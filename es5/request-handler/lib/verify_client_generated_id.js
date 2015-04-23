'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

exports['default'] = function (request) {
  var err;
  var data = request.body.data;

  if (Array.isArray(data)) {
    err = _import2['default'].some(data, 'id');
  } else {
    err = !!data.id;
  }

  return err ? _Kapow2['default'](403, 'Client generated IDs are not enabled.') : null;
};

module.exports = exports['default'];