/**
 * Deletes a model.
 *
 * @param {Bookshelf.Model} model
 * @return {Promise.Bookshelf.Model} The deleted model.
 */
'use strict';

exports.__esModule = true;
exports['default'] = destroy;

function destroy(model) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return model.destroy();
}

module.exports = exports['default'];