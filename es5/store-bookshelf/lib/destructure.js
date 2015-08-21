// FIXME: this needs to be refactored to support other api formats, or
// moved wholesale into another model

'use strict';

exports.__esModule = true;
exports['default'] = destructure;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _columns = require('./columns');

var _columns2 = _interopRequireDefault(_columns);

var _to_one_relations = require('./to_one_relations');

var _to_one_relations2 = _interopRequireDefault(_to_one_relations);

var _all_relations = require('./all_relations');

var _all_relations2 = _interopRequireDefault(_all_relations);

function destructure(model) {
  var params = arguments[1] === undefined ? {} : arguments[1];

  var relationships = params.relationships || {};
  var relationshipNames = _lodash2['default'].keys(relationships);
  var allRels = (0, _all_relations2['default'])(model);
  var toOneRelsMap = (0, _to_one_relations2['default'])(model);
  var toOneRels = Object.keys(toOneRelsMap);
  var toManyRels = _lodash2['default'].difference(allRels, toOneRels);
  var linkedToOneRels = _lodash2['default'].intersection(relationshipNames, toOneRels);
  var linkedToManyRels = _lodash2['default'].intersection(relationshipNames, toManyRels);

  // TODO blow up here with kapow, someone is trying to link something that
  // doesn't exist.
  //const badRelations = _.difference(linkRelations, allRels);

  // TODO we need a hook to check if the target related resources exist
  // so we can blow up if they don't.
  // This hook should have context about the request so we can enforce
  // permissions based on who is trying to update/create something.
  var attributes = linkedToOneRels.reduce(function (result, relationName) {
    var relation = relationships[relationName];
    var fkey = toOneRelsMap[relationName];
    var value = relation.data && relation.data.id;
    result[fkey] = value;
    return result;
  }, params.attributes || {});

  var relations = linkedToManyRels.map(function (relationName) {
    var relation = relationships[relationName];
    return {
      name: relationName,
      data: relation.data
    };
  });

  return (0, _columns2['default'])(model).then(function (modelColumns) {
    if (_lodash2['default'].contains(modelColumns, 'id') && params.id) {
      attributes.id = params.id;
    }
    return { attributes: attributes, relations: relations };
  });
}

module.exports = exports['default'];