/**
 * Return models from a collection.
 *
 * @param {Bookshelf.Collection} collection
 * @return {Array}
 */
export default function modelsFromCollection (collection) {
  return collection.models;
}
