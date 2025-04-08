'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

var _isMyJsonValid = require('is-my-json-valid');

var _isMyJsonValid2 = _interopRequireDefault(_isMyJsonValid);

function transformErrorFields(input, errors) {
  return errors.map(function (error) {
    var field = error.field.replace(/^data/, input);
    return _kapow2['default'](400, field + ' ' + error.message, error);
  });
}

exports['default'] = function (request, endpoint) {
  var err;
  var schema = endpoint.config.schema || {};

  for (var prop in schema) {
    var validate = _isMyJsonValid2['default'](schema[prop] || {});
    if (!validate(request[prop])) {
      err = transformErrorFields(prop, validate.errors);
      break;
    }
  }
  return err;
};

module.exports = exports['default'];