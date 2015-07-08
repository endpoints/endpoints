'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function relate(model, relationName, data, mode, transaction) {
  // TODO: does bookshelf support polymorphic fields in attach/detach?
  var ids = Array.isArray(data) ? _lodash2['default'].pluck(data, 'id') : data.id;

  // TODO: move this into its own method and use the exported
  // function to call different ones depending on the mode
  if (mode === 'delete') {
    return model.related(relationName).detach(ids, {
      transacting: transaction
    });
  }

  // TODO: support nested relations?
  // model.related will break for dot-notated relations
  return model.related(relationName).detach(undefined, {
    transacting: transaction
  }).then(function () {
    return model.related(relationName).attach(ids, {
      transacting: transaction
    });
  })['return'](model);
}

/**
 * Update relations on a model within a transaction.
 *
 * @param {Bookshelf.Model} model
 * @param {Object} relations
 * @param {String} mode
 * @param {Bookshelf.Transaction} transaction
 * @return {Bookshelf.Model}
 */

exports['default'] = function (model, relations, mode, transaction) {
  if (Array.isArray(relations)) {
    return _bluebird2['default'].map(relations, function (rel) {
      return relate(model, rel.name, rel.data, mode, transaction);
    });
  } else {
    return relate(model, relations.name, relations.data, mode, transaction);
  }
};

module.exports = exports['default'];