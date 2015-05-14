'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

exports['default'] = function (model) {
  var columns = model.constructor.columns;
  // populate the field listing for a table so we know which columns
  // we can use for sparse fieldsets.
  if (!columns) {
    return model.query().columnInfo().then(function (info) {
      model.constructor.columns = Object.keys(info);
      return model.constructor.columns;
    });
  }
  return _bluebird2['default'].resolve(columns);
};

module.exports = exports['default'];