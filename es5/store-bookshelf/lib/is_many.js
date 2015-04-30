"use strict";

exports.__esModule = true;
/**
 * Return true if the supplied input is a collection.
 *
 * @param {Bookshelf.Model|Bookshelf.Collection} input
 * @return {Boolean}
 */
exports["default"] = isMany;

function isMany(input) {
  return !!input.models;
}

module.exports = exports["default"];