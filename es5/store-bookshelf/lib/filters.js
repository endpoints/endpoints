"use strict";

exports.__esModule = true;
/**
 * Return the filters of a Bookshelf model.
 *
 * @param {Bookshelf.Model} model
 * @return {String}
 */
exports["default"] = filters;

function filters(model) {
  return model.filters;
}

module.exports = exports["default"];