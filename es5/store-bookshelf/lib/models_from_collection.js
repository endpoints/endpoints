"use strict";

exports.__esModule = true;
/**
 * Return models from a collection.
 *
 * @param {Bookshelf.Collection} collection
 * @return {Array}
 */
exports["default"] = modelsFromCollection;

function modelsFromCollection(collection) {
  return collection.models;
}

module.exports = exports["default"];