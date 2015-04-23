'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

exports['default'] = function (model) {
  if (!model) {
    throw _Kapow2['default'](404, 'Unable to locate model.');
  }

  // Bookshelf throws an error for any number of unrelated reasons.
  // json-api requires we throw specific errors for certain situations.
  if (model instanceof Error) {
    if (/No rows were affected/.test(model.message) || /Unable to locate model/.test(model.message)) {
      model = _Kapow2['default'].wrap(model, 404);
    } else {
      model = _Kapow2['default'].wrap(model, 500);
    }
    throw model;
  }

  return model;
};

module.exports = exports['default'];