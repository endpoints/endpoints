'use strict';

exports.__esModule = true;
exports['default'] = update;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _destructure = require('./destructure');

var _destructure2 = _interopRequireDefault(_destructure);

var _transact = require('./_transact');

var _transact2 = _interopRequireDefault(_transact);

var _relate = require('./relate');

var _relate2 = _interopRequireDefault(_relate);

/**
 * Updates a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {Object} params - An object containing the params from the request.
 * @returns {Promise.Bookshelf.Model|null} -
     The updated model or null if nothing has changed.
 */

function update(model) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (!model) {
    throw new Error('No model provided.');
  }
  var currentState = model.toJSON({ shallow: true });
  currentState.id = String(currentState.id);

  return _destructure2['default'](model, params).then(function (destructured) {
    var attributes = destructured.attributes;
    var relations = destructured.relations;

    return _transact2['default'](model, function (transaction) {
      return model.save(attributes, {
        patch: true,
        method: 'update',
        transacting: transaction
      }).tap(function (model) {
        return _relate2['default'](model, relations, 'update', transaction);
      }).then(function (model) {
        // if model didn't change, return null
        // model.previousAttributes() is broken.
        // https://github.com/tgriesser/bookshelf/issues/326
        var updatedState = model.toJSON({ shallow: true });
        updatedState.id = String(updatedState.id);
        return _lodash2['default'].isEqual(currentState, updatedState) ? null : model;
      });
    });
  });
}

module.exports = exports['default'];