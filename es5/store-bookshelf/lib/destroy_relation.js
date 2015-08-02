'use strict';

exports.__esModule = true;
exports['default'] = destroyRelation;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _destructure = require('./destructure');

var _destructure2 = _interopRequireDefault(_destructure);

var _transact = require('./_transact');

var _transact2 = _interopRequireDefault(_transact);

var _relate = require('./relate');

/**
 * Destroys relations on a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {Object} relations - An object containing the relations.
 * @return {Promise.Bookshelf.Model} The updated model.
 */

var _relate2 = _interopRequireDefault(_relate);

function destroyRelation(model, relations) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return _destructure2['default'](model, relations).then(function (destructured) {
    var relations = destructured.relations;
    return _transact2['default'](model, function (transaction) {
      return _relate2['default'](model, relations, 'delete', transaction);
    });
  });
}

module.exports = exports['default'];