import allRelations from './all_relations';

/**
 * Return an object keyed by to-one relation names whose values are the
 * attribute on the model that represents the relation. For exmaple, given
 * a Book model that stored its author as `author_id` and relation name of
 * `author`, this method would return `{ author: 'author_id' }`.
 *
 * @param {Bookshelf.Model} model
 * @return {Object}
 */
export default function toOneRelations (model) {
  return allRelations(model).reduce(function (result, relation) {
    // nested relations are specified by dot notated strings
    // if a relation has a dot in it, it is nested, and therefor
    // cannot be a toOne relation. ignore it.
    if (relation.indexOf('.') !== -1) {
      return result;
    }
    // find related information about the model
    var related = model.related(relation);
    // if a relation is specified on the model that doesn't
    // actually exist, we should bail out quickly.
    if (!related) {
      throw new Error(
        'Relation ' + relation + ' is not defined on ' + model.tableName
      );
    }
    var relatedData = related.relatedData;
    // is this relation of a kind we care about? if yes, add it!
    // TODO: support polymorphic relations.
    if (relatedData.type === 'belongsTo') {
      result[relation] = relatedData.foreignKey;
    }
    return result;
  }, {});
}
