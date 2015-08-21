'use strict';

exports.__esModule = true;
exports['default'] = byId;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

function byId(model, id, relations) {
  return model.collection().query(function (qb) {
    return qb.where({ id: id });
  }).fetchOne({
    withRelated: relations
  })['catch'](TypeError, function (e) {
    // A TypeError here most likely signifies bad
    // relations passed into withRelated
    throw (0, _kapow2['default'])(404, 'Unable to find relations');
  });
}

module.exports = exports['default'];