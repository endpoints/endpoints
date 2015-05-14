import destructure from './destructure';
import transact from './_transact';
import relate from './relate';

/**
 * Destroys relations on a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {Object} relations - An object containing the relations.
 * @return {Promise.Bookshelf.Model} The updated model.
 */
export default function destroyRelation (model, relations) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return destructure(model, relations).then(function (destructured) {
    const relations = destructured.relations;
    return transact(model, function (transaction) {
      return relate(model, relations, 'delete', transaction);
    });
  });
}
