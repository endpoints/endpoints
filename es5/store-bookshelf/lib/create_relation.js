'use strict';

exports.__esModule = true;
exports['default'] = createRelation;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _id = require('./id');

var _id2 = _interopRequireDefault(_id);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _relate = require('./relate');

var _relate2 = _interopRequireDefault(_relate);

var _related = require('./related');

var _related2 = _interopRequireDefault(_related);

var _transact = require('./_transact');

/**
 * Creates a new relations on a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {String} relationName - An object containing the relations.
 * @param {Array} data - linkage data
 * @returns {Promise.Bookshelf.Model} The updated model.
 */

var _transact2 = _interopRequireDefault(_transact);

function createRelation(model, relationName, data) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return _transact2['default'](model, function (transaction) {
    var existing = _related2['default'](model, relationName).map(function (rel) {
      return {
        id: _id2['default'](rel),
        type: _type2['default'](rel)
      };
    });
    var all = data.concat(existing);
    // TODO: should i be doing a deep comparison instead?
    var unique = _lodash2['default'].uniq(all, JSON.stringify.bind(null));
    return _relate2['default'](model, {
      name: relationName,
      data: unique
    }, 'add', transaction);
  });
}

module.exports = exports['default'];