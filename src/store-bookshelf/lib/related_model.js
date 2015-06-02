/**
 * Get a model realted to a given model by relation name.
 *
 * @param {Bookshelf.Model} model
 * @param {String} relationName
 * @return {Bookshelf.Model}
 */
export default function (model, relationName) {
  const src = model.forge ? model : model.constructor;
  return src.forge().related(relationName).relatedData.target;
}
