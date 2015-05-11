'use strict';

exports.__esModule = true;

/**
 * Updates a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {String} method - The method on the model instance to use when updating.
 * @param {Object} params - An object containing the params from the request.
 * @returns {Promise.Bookshelf.Model} The updated model.
 */
exports['default'] = update;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _destructure = require('./destructure');

var _destructure2 = _interopRequireDefault(_destructure);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _transact = require('./_transact');

var _transact2 = _interopRequireDefault(_transact);

function update(model, method, params) {
  if (!model) {
    throw new Error('No model provided.');
  }
  if (!method) {
    throw new Error('No method provided to update with.');
  }
  if (!model.constructor.prototype.update) {
    model.constructor.prototype.update = baseUpdate;
  }
  return _destructure2['default'](model, params).then(function (destructured) {
    return _transact2['default'](model, function (transaction) {
      return model[method](transaction, destructured.attributes, destructured.relations, _serialize2['default'](model));
    });
  });
}

// FIXME: the stuff below is gross. upstream to bookshelf... or something.

function baseUpdate(transaction, attributes, relations, previous) {
  var clientState = _lodash2['default'].extend(previous, attributes);
  return this.save(attributes, {
    patch: true,
    method: 'update',
    transacting: transaction
  }).tap(function (model) {
    return _bluebird2['default'].map(relations, function (rel) {
      return model.related(rel.name).detach(undefined, {
        transacting: transaction
      }).then(function () {
        return model.related(rel.name).attach(rel.id, {
          transacting: transaction
        });
      });
    });
  }).then(function (model) {
    // Bookshelf .previousAttributes() doesn't work
    // See: https://github.com/tgriesser/bookshelf/issues/326#issuecomment-76637186
    if (_lodash2['default'].isEqual(model.toJSON({ shallow: true }), clientState)) {
      return null;
    }
    return model;
  });
}
module.exports = exports['default'];