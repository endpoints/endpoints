'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

exports['default'] = function (model) {
  if (model) {
    throw _kapow2['default'](409, 'Model with this ID already exists');
  }
  return model;
};

module.exports = exports['default'];