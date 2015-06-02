/**
 * Generate an empty collection for a Bookshelf model relation.
 *
 * @param {Bookshelf.Model} model
 * @param {String} relationName
 * @return {Bookshelf.Collection}
 */
"use strict";

exports.__esModule = true;

exports["default"] = function (model, relationName) {
  var src = model.forge ? model : model.constructor;
  return src.forge().related(relationName).relatedData.target.collection();
};

module.exports = exports["default"];