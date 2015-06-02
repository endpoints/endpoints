/**
 * Generate an empty collection for a Bookshelf model relation.
 *
 * @param {Bookshelf.Model} model
 * @param {String} relationName
 * @return {Bookshelf.Collection}
 */
export default function (model, relationName) {
  const src = model.forge ? model : model.constructor;
  return src.forge().related(relationName).relatedData.target.collection();
}
