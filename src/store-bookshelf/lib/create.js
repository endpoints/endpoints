import transact from './_transact';
import destructure from './destructure';
import relate from './relate';
import read from './read';

/**
 * Creates a model.
 *
 * @param {Bookshelf.Model} model - A bookshelf model instance
 * @param {Object} params - An object containing the params from the request.
 * @param {Object} config - The config for the controller calling this.
 * @returns {Promise.Bookshelf.Model} The created model.
 */
export default function create (model, params={}, config={}) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return destructure(model.forge(), params).then(function(destructured) {
    const {attributes, relations} = destructured;
    return transact(model, function (transaction) {
      return model.forge(attributes).save(null, {
        method: 'insert',
        transacting: transaction
      })
      .tap((newModel) => {
        return relate(newModel, relations, 'create', transaction);
      })
      .tap(transaction.commit)
      .then((newModel) => {
        config.filter.id = newModel.id;
        config.singleResult = true;
        return read(model, config);
      });
    });
  });
}
