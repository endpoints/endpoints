"use strict";

exports.__esModule = true;
/**
 * Return the json-api type of a Bookshelf model. Prefer the static
 * property `typeName`, but failover to tableName on the prototype
 * if needed.
 *
 * @param {Bookshelf.Model} model
 * @return {String}
 */
exports["default"] = type;

function type(model) {
  return model.constructor.typeName || model.typeName || model.prototype && model.prototype.tableName || model.tableName;
}

module.exports = exports["default"];