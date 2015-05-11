import bPromise from 'bluebird';

import transact from './_transact';
import destructure from './destructure';

export default function create (model, method, params) {
  if (!model) {
    throw new Error('No model provided.');
  }
  if (!method) {
    throw new Error('No method provided to create with.');
  }
  if (!params) {
    params = {};
  }
  if (!model.create) {
    model.create = baseCreate;
  }
  return destructure(model.forge(), params).then(function(destructured) {
    return transact(model, function (transaction) {
      return model[method](
        transaction,
        destructured.attributes,
        destructured.relations
      );
    });
  });
}

// FIXME: the stuff below is gross. upstream to bookshelf... or something.

function baseCreate (transaction, attributes, relations) {
  // this should be in a transaction but we don't have access to it yet
  return this.forge(attributes).save(null, {
    method: 'insert',
    transacting: transaction
  }).tap(function (model) {
    return bPromise.map(relations, function(rel) {
      return model.related(rel.name).detach(undefined, {
        transacting: transaction
      }).then(function() {
        return model.related(rel.name).attach(rel.id, {
          transacting: transaction
        });
      });
    });
  }).then(function(model) {
    return this.forge({id:model.id}).fetch({
      transacting: transaction
    });
  }.bind(this));
}
