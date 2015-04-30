import _ from 'lodash';
import bPromise from 'bluebird';
import destructure from './destructure';
import serialize from './serialize';

/**
 * Updates a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {String} method - The method on the model instance to use when updating.
 * @param {Object} params - An object containing the params from the request.
 * @returns {Promise.Bookshelf.Model} The updated model.
 */
export default function update (model, method, params) {
  if (!model) {
    throw new Error('No model provided.');
  }
  if (!method) {
    throw new Error('No method provided to update with.');
  }
  if (!model.constructor.prototype.update) {
    model.constructor.prototype.update = baseUpdate;
  }
  return destructure(model, params).then(function(destructured) {
    return model[method](
      destructured.data,
      destructured.toManyRels,
      serialize(model)
    );
  });
}

// FIXME: the stuff below is gross. upstream to bookshelf... or something.

function baseUpdate (params, toManyRels, previous) {
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
