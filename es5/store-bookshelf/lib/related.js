'use strict';

exports.__esModule = true;
exports['default'] = related;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _related_collection = require('./related_collection');

var _related_collection2 = _interopRequireDefault(_related_collection);

var _is_many = require('./is_many');

var _is_many2 = _interopRequireDefault(_is_many);

/**
 * Given a model or collection and a dot-notated relation string,
 * traverse the relations and return the related models from the
 * last segment in the relation string.
 *
 * @param {Bookshelf.Model|Bookshelf.Collection} input
 * @param {String} relation
 * @return {Bookshelf.Model|Bookshelf.Collection}
 */

function related(input, relation) {
  return relation.split('.').reduce(function (input, relationSegment) {
    if ((0, _is_many2['default'])(input)) {
      // iterate each model and add its related models to the collection
      return input.reduce(function (result, model) {
        var related = model.related(relationSegment);
        return result.add(related.models ? related.models : related);
      }, (0, _related_collection2['default'])(input.model, relationSegment));
    }
    return input.related(relationSegment);
  }, input);
}

module.exports = exports['default'];