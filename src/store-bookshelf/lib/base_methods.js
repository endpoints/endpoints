import _ from 'lodash';
import bPromise from 'bluebird';

export function create (params, toManyRels) {
  // this should be in a transaction but we don't have access to it yet
  return this.forge(params).save(null, {method: 'insert'}).tap(function (model) {
    return bPromise.map(toManyRels, function(rel) {
      return model.related(rel.name).attach(rel.id);
    });
  }).then(function(model) {
    return this.forge({id:model.id}).fetch();
  }.bind(this));
}

export function update (params, toManyRels, previous) {
  // this should be in a transaction but we don't have access to it yet
  const clientState = _.extend(previous, params);
  return this.save(params, {patch: true, method: 'update'}).tap(function (model) {
    return bPromise.map(toManyRels, function(rel) {
      return model.related(rel.name).detach().then(function() {
        return model.related(rel.name).attach(rel.id);
      });
    });
  }).then(function(model) {
    // Bookshelf .previousAttributes() doesn't work
    // See: https://github.com/tgriesser/bookshelf/issues/326#issuecomment-76637186
    if (_.isEqual(model.toJSON({shallow: true}), clientState)) {
      return null;
    }
    return model;
  });
}
