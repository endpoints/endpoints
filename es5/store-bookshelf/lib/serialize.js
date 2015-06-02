/**
 * Return the provided model as JSON. We specify shallow here so
 * that relations are not automatically nested in the response.
 *
 * @param {Bookshelf.Model} model
 * @return {Object}
 */
"use strict";

exports.__esModule = true;
exports["default"] = serialize;

function serialize(model) {
  return model.toJSON({ shallow: true });
}

module.exports = exports["default"];