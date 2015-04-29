'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireDefault(_Kapow);

var _validator = require('is-my-json-valid');

var _validator2 = _interopRequireDefault(_validator);

function transformErrorFields(input, errors) {
  return errors.map(function (error) {
    var field = error.field.replace(/^data/, input);
    return _Kapow2['default'](400, field + ' ' + error.message, error);
  });
}

exports['default'] = function (request, endpoint) {
  var err;
  var schema = endpoint.schema || {};

  for (var prop in schema) {
    var validate = _validator2['default'](schema[prop] || {});
    if (!validate(request[prop])) {
      err = transformErrorFields(prop, validate.errors);
      break;
    }
  }
  return err;
};

module.exports = exports['default'];