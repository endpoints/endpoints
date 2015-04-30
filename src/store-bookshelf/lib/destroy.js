import serialize from './serialize';
import destructure from './destructure';

/**
 * Deletes a model. Same implementation as update.
 *
 * @param {Bookshelf.Model} model
 * @param {String} method - The method on the model instance to use when deleting.
 * @param {Object} params - An object containing the params from the request.
 * @return {Promise.Bookshelf.Model} The deleted model.
 */
export default function destroy (model, method, params) {
  if (!method) {
    throw new Error('No method provided to delete with.');
  }
  return destructure(model, params).then(function(destructured) {
    return model[method](
      destructured.data,
      destructured.toManyRels,
      serialize(model)
    );
  });
}
