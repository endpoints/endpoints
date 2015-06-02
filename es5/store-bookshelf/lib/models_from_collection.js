/**
 * Return models from a collection.
 *
 * @param {Bookshelf.Collection} collection
 * @return {Array}
 */
"use strict";

exports.__esModule = true;
exports["default"] = modelsFromCollection;

function modelsFromCollection(collection) {
  return collection.models;
}

module.exports = exports["default"];