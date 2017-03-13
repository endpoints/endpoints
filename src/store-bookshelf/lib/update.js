import _ from 'lodash';
import destructure from './destructure';
import transact from './_transact';
import relate from './relate';

/**
 * Updates a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {Object} params - An object containing the params from the request.
 * @param {Object} config - The config for the controller calling this.
 * @returns {Promise.Bookshelf.Model|null} -
     The updated model or null if nothing has changed.
 */
export default function update (model, params={}, config={}) {
  if (!model) {
    throw new Error('No model provided.');
  }
  const currentState = model.toJSON({shallow:true});
  currentState.id = String(currentState.id);

  return destructure(model, params).then(function (destructured) {
    const {attributes, relations} = destructured;
    return transact(model, function (transaction) {
      return model.save(attributes, {
        patch: true,
        method: 'update',
        transacting: transaction
      })
      .tap((model) => {
        return relate(model, relations, 'update', transaction);
      })
      .then((model) => {
        // if model didn't change, return null
        // model.previousAttributes() is broken.
        // https://github.com/tgriesser/bookshelf/issues/326
        const updatedState = model.toJSON({shallow:true});
        updatedState.id = String(updatedState.id);
        return _.isEqual(currentState, updatedState) ? null : model;
      });
    });
  });
}
