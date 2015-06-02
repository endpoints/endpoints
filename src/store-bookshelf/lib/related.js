import relatedCollection from './related_collection';
import isMany from './is_many';

/**
 * Given a model or collection and a dot-notated relation string,
 * traverse the relations and return the related models from the
 * last segment in the relation string.
 *
 * @param {Bookshelf.Model|Bookshelf.Collection} input
 * @param {String} relation
 * @return {Bookshelf.Model|Bookshelf.Collection}
 */
export default function related (input, relation) {
  return relation.split('.').reduce(function (input, relationSegment) {
    if (isMany(input)) {
      // iterate each model and add its related models to the collection
      return input.reduce(function (result, model) {
        var related = model.related(relationSegment);
        return result.add(related.models ? related.models : related);
      }, relatedCollection(input.model, relationSegment));
    }
    return input.related(relationSegment);
  }, input);
}
