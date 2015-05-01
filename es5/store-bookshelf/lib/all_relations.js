"use strict";

exports.__esModule = true;
/**
 * Return all relations names for a supplied model. It is expected that valid
 * relations will be enumerated as an array on the static property `relations`
 * for each model. These will be used to determine what appears in the `links`
 * object for a given entity.
 *
 * This is required because Bookshelf does not provide static analysis (yet),
 *
 * That said, once static analysis is available, it will be possible to
 * automatically detect relations. Even so, it will remain desirable to
 * support enumerating them manually, as this allows the user to specify
 * which relations should appear.
 *
 * TODO: support relations to external APIs.
 *
 * @param {Bookshelf.Model} model
 * @return {Array}
 */
exports["default"] = allRelations;

function allRelations(model) {
  return model.constructor.relations || model.relations || [];
}

module.exports = exports["default"];