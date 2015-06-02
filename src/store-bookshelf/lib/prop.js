/**
 * Return a property from a provided model.
 *
 * @param {Bookshelf.Model} model
 * @param {String} property
 * @return {String|null}
 */
export default function (model, property) {
  return model.get(property);
}
