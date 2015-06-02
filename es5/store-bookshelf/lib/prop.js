/**
 * Return a property from a provided model.
 *
 * @param {Bookshelf.Model} model
 * @param {String} property
 * @return {String|null}
 */
"use strict";

exports.__esModule = true;

exports["default"] = function (model, property) {
  return model.get(property);
};

module.exports = exports["default"];