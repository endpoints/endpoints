/**
 * Deletes a model.
 *
 * @param {Bookshelf.Model} model
 * @return {Promise.Bookshelf.Model} The deleted model.
 */
export default function destroy (model) {
  if (!model) {
    throw new Error('No model provided.');
  }
  return model.destroy();
}
