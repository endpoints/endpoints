'use strict';

exports.__esModule = true;

/**
 * Given a model or collection and a dot-notated relation string,
 * traverse the relations and return the related models from the
 * last segment in the relation string.
 *
 * @param {Bookshelf.Model|Bookshelf.Collection} input
 * @param {String} relation
 * @return {Bookshelf.Model|Bookshelf.Collection}
 */
exports['default'] = related;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _is_many = require('./is_many');

var _is_many2 = _interopRequireDefault(_is_many);

function related(input, relation) {
  return relation.split('.').reduce(function (input, relationSegment) {
    if (_is_many2['default'](input)) {
      // iterate each model and add its related models to the collection
      return input.reduce(function (result, model) {
        var related = model.related(relationSegment);
        return result.add(related.models ? related.models : related);
      }, generateRelatedCollection(input.model, relationSegment));
    }
    return input.related(relationSegment);
  }, input);
}

/**
 * Generate an empty collection for a Bookshelf model relation.
 *
 * @param {Bookshelf.Model} model
 * @param {String} relationName
 * @return {Bookshelf.Collection}
 */
function generateRelatedCollection(model, relationName) {
  return model.forge().related(relationName).relatedData.target.collection();
}
module.exports = exports['default'];