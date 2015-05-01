import bPromise from 'bluebird';

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
    return model[method](
      destructured.data,
      destructured.toManyRels
    );
  });
}

// FIXME: the stuff below is gross. upstream to bookshelf... or something.

function baseCreate (params, toManyRels) {
  // this should be in a transaction but we don't have access to it yet
  return this.forge(params).save(null, {method: 'insert'}).tap(function (model) {
    return bPromise.map(toManyRels, function(rel) {
      return model.related(rel.name).attach(rel.id);
    });
  }).then(function(model) {
    return this.forge({id:model.id}).fetch();
  }.bind(this));
}
