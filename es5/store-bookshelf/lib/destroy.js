'use strict';

exports.__esModule = true;

/**
 * Deletes a model. Same implementation as update.
 *
 * @param {Bookshelf.Model} model
 * @param {String} method - The method on the model instance to use when deleting.
 * @param {Object} params - An object containing the params from the request.
 * @return {Promise.Bookshelf.Model} The deleted model.
 */
exports['default'] = destroy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _destructure = require('./destructure');

var _destructure2 = _interopRequireDefault(_destructure);

function destroy(model, method, params) {
  if (!method) {
    throw new Error('No method provided to delete with.');
  }
  return _destructure2['default'](model, params).then(function (destructured) {
    return model[method](destructured.attributes, destructured.relations, _serialize2['default'](model));
  });
}

module.exports = exports['default'];