'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _bPromise = require('bluebird');

var _bPromise2 = _interopRequireWildcard(_bPromise);

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

// this is required because bookshelf doesn't support transactions.
// as a result, we have to preflight check every single relation
// id to ensure it actually exists before we try to insert anything.
// this is mad inefficient, but that's okay, a future version of
// bookshelf will resolve this madness.
exports['default'] = _bPromise2['default'].method(function (model, relationName, id) {
  var toMany = _import2['default'].isArray(id);
  var relation = model.related(relationName);
  if (!relation) {
    throw _Kapow2['default'](404, 'Unable to find relation "' + relationName + '".');
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
      missing = _import2['default'].difference(id, result.pluck('id')).join(', ');
    }
    if (!toMany && result.length === 0) {
      missing = id;
    }
    if (missing) {
      throw _Kapow2['default'](404, 'Unable to find "' + relation + ' id(s): ' + missing + '"');
    }
    return true;
  });
});
module.exports = exports['default'];