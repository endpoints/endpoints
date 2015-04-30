/**
 * Return true if the supplied input is a collection.
 *
 * @param {Bookshelf.Model|Bookshelf.Collection} input
 * @return {Boolean}
 */
export default function isMany (input) {
  return !!input.models;
}
