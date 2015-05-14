"use strict";

exports.__esModule = true;
/**
 * Return the ID of a provided model as a string, or null if non is present.
 *
 * @param {Bookshelf.Model} model
 * @return {String|null}
 */
exports["default"] = id;

function id(model) {
  return model.id ? String(model.id) : null;
}

module.exports = exports["default"];