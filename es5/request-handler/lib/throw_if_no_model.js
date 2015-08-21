'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

exports['default'] = function (model) {
  if (!model) {
    throw (0, _kapow2['default'])(404, 'Unable to locate model.');
  }

  // Bookshelf throws an error for any number of unrelated reasons.
  // json-api requires we throw specific errors for certain situations.
  if (model instanceof Error) {
    if (/No rows were affected/.test(model.message) || /Unable to locate model/.test(model.message)) {
      model = _kapow2['default'].wrap(model, 404);
    } else {
      model = _kapow2['default'].wrap(model, 500);
    }
    throw model;
  }

  return model;
};

module.exports = exports['default'];