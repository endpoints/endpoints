'use strict';

var Kapow = require('kapow');

var validator = require('is-my-json-valid');

function transformErrorFields(input, errors) {
  return errors.map(function (error) {
    var field = error.field.replace(/^data/, input);
    return Kapow(400, field + ' ' + error.message, error);
  });
}

module.exports = function (request, endpoint) {
  var err;
  var schema = endpoint.schema || {};

  for (var prop in schema) {
    var validate = validator(schema[prop] || {});
    if (!validate(request[prop])) {
      err = transformErrorFields(prop, validate.errors);
      break;
    }
  }
  return err;
};