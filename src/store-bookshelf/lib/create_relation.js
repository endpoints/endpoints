import _ from 'lodash';

import id from './id';
import type from './type';
import relate from './relate';
import related from './related';
import transact from './_transact';

/**
 * Creates a new relations on a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {String} relationName - An object containing the relations.
 * @param {Array} data - linkage data
 * @returns {Promise.Bookshelf.Model} The updated model.
 */
export default function createRelation (model, relationName, data) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return transact(model, function (transaction) {
    const existing = related(model, relationName).map((rel) => {
      return {
        id: id(rel),
        type: type(rel)
      };
    });
    const all = data.concat(existing);
    // TODO: should i be doing a deep comparison instead?
    const unique = _.uniq(all, JSON.stringify.bind(null));
    return relate(model, {
      name: relationName,
      data: unique
    }, 'add', transaction);
  });
}
