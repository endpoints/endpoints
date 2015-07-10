'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

exports['default'] = function (request) {
  var err;
  var data = request.body.data;

  if (Array.isArray(data)) {
    err = _lodash2['default'].some(data, 'id');
  } else {
    err = !!data.id;
  }

  return err ? _kapow2['default'](403, 'Client generated IDs are not enabled.') : null;
};

module.exports = exports['default'];