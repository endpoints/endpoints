'use strict';

exports.__esModule = true;
exports['default'] = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _transact = require('./_transact');

var _transact2 = _interopRequireDefault(_transact);

var _destructure = require('./destructure');

var _destructure2 = _interopRequireDefault(_destructure);

var _relate = require('./relate');

var _relate2 = _interopRequireDefault(_relate);

/**
 * Creates a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {Object} params - An object containing the params from the request.
 * @returns {Promise.Bookshelf.Model} The created model.
 */

function create(model) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (!model) {
    throw new Error('No model provided.');
  }
  return _destructure2['default'](model.forge(), params).then(function (destructured) {
    var attributes = destructured.attributes;
    var relations = destructured.relations;

    return _transact2['default'](model, function (transaction) {
      return model.forge(attributes).save(null, {
        method: 'insert',
        transacting: transaction
      }).tap(function (newModel) {
        return _relate2['default'](newModel, relations, 'create', transaction);
      }).then(function (newModel) {
        return model.forge({ id: newModel.id }).fetch({ transacting: transaction });
      });
    });
  });
}

module.exports = exports['default'];