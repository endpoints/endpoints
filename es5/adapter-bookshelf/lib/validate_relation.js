'use strict';

var _ = require('lodash');

var bPromise = require('bluebird');
var Kapow = require('kapow');

// this is required because bookshelf doesn't support transactions.
// as a result, we have to preflight check every single relation
// id to ensure it actually exists before we try to insert anything.
// this is mad inefficient, but that's okay, a future version of
// bookshelf will resolve this madness.
module.exports = bPromise.method(function (model, relationName, id) {
  var toMany = _.isArray(id);
  var relation = model.related(relationName);
  if (!relation) {
    throw Kapow(404, 'Unable to find relation "' + relationName + '".');
  }

  // TODO: determine what should happen if you try to set a toMany relation
  // to null instead of an empty array.
  if (id === null) {
    return true;
  }

  return relation.relatedData.target.collection().query(function (qb) {
    qb.whereIn('id', id);
  }).fetch().then(function (result) {
    var missing;
    if (toMany && result.length != id.length) {
      missing = _.difference(id, result.pluck('id')).join(', ');
    }
    if (!toMany && result.length === 0) {
      missing = id;
    }
    if (missing) {
      throw Kapow(404, 'Unable to find "' + relation + ' id(s): ' + missing + '"');
    }
    return true;
  });
});