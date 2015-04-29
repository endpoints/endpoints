'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _toOneRelations = require('./to_one_relations');

var _toOneRelations2 = _interopRequireDefault(_toOneRelations);

var _link = require('./link');

var _link2 = _interopRequireDefault(_link);

exports['default'] = function (opts, model) {
  var topLevelLinks;
  var exporter = opts && opts.exporter;
  var mode = opts && opts.mode;
  var relations = opts && opts.relations;

  // get the underlying model type
  var typeName = model.constructor.typeName;
  // get the list of relations we intend to include (sideload)
  var linkWithInclude = relations;
  // get all possible relations for the model
  var allRelations = model.constructor.relations;
  // of all listed relations, determine which are toOne relations
  var toOneRels = _toOneRelations2['default'](model, allRelations);
  // get the list of relations we have not included
  var linkWithoutInclude = _import2['default'].difference(allRelations, linkWithInclude);
  // get a json representation of the model, excluding any related data
  var serialized = model.toJSON({ shallow: true });
  // json-api requires id be a string -- shouldn't rely on server
  serialized.id = String(serialized.id);
  // Include type on primary resource
  serialized.type = typeName;
  // Remove foreign keys from model
  for (var rel in toOneRels) {
    delete serialized[toOneRels[rel]];
  }
  if (mode === 'relation') {
    topLevelLinks = _link2['default'](model, opts);
  } else {
    serialized.links = _link2['default'](model, {
      linkWithInclude: linkWithInclude,
      linkWithoutInclude: linkWithoutInclude,
      exporter: exporter
    });
  }
  return serialized;
};

module.exports = exports['default'];