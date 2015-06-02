/**
 * Get a model realted to a given model by relation name.
 *
 * @param {Bookshelf.Model} model
 * @param {String} relationName
 * @return {Bookshelf.Model}
 */
"use strict";

exports.__esModule = true;

exports["default"] = function (model, relationName) {
  var src = model.forge ? model : model.constructor;
  return src.forge().related(relationName).relatedData.target;
};

module.exports = exports["default"];