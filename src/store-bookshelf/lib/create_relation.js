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
 * @param {Array} linkage - Linkage objects.
 * @returns {Promise.Bookshelf.Model} The updated model.
 */
export default function createRelation (model, relationName, linkage) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return transact(model, function (transaction) {
    const existingLinkage = related(model, relationName).map((rel) => {
      return {
        id: id(rel),
        type: type(rel)
      };
    });
    const allLinkage = linkage.concat(existingLinkage);
    // TODO: should i be doing a deep comparison instead?
    const uniqueLinkage = _.uniq(allLinkage, JSON.stringify.bind(null));
    return relate(model, {
      name: relationName,
      linkage: uniqueLinkage
    }, 'add', transaction);
  });
}
