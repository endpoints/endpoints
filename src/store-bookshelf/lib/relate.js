import bPromise from 'bluebird';
import _ from 'lodash';

function relate (model, relationName, linkage, mode, transaction) {
  // TODO: does bookshelf support polymorphic fields in attach/detach?
  const ids = _.pluck(linkage, 'id');

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
  })
  .then(() => {
    return model.related(relationName).attach(ids, {
      transacting: transaction
    });
  })
  .return(model);
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
export default function (model, relations, mode, transaction) {
  if (Array.isArray(relations)) {
    return bPromise.map(relations, (rel) => {
      return relate(model, rel.name, rel.linkage, mode, transaction);
    });
  } else {
    return relate(model, relations.name, relations.linkage, mode, transaction);
  }
}
