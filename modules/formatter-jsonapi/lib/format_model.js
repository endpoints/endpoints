const _ = require('lodash');

const toOneRelations = require('./to_one_relations');
const link = require('./link');

module.exports = function formatModel(relations, exporter, model) {
  // get the underlying model type
  var typeName = model.constructor.typeName;
  // get the list of relations we intend to include (sideload)
  var linkWithInclude = relations;
  // get all possible relations for the model
  var allRelations = model.constructor.relations;
  // of all listed relations, determine which are toOne relations
  var toOneRels = toOneRelations(model, allRelations);
  // get the list of relations we have not included
  var linkWithoutInclude = _.difference(allRelations, linkWithInclude);
  // figure out which toOne relations we have not explictly included
  var toOneWithoutInclude = _.intersection(linkWithoutInclude, Object.keys(toOneRels));
  // figure out which toMany relations we have not explictly included
  var toManyWithoutInclude = _.difference(linkWithoutInclude, toOneWithoutInclude);
  // get a json representation of the model, excluding any related data
  var serialized = model.toJSON({shallow:true});
  // json-api requires id be a string -- shouldn't rely on server
  serialized.id = String(serialized.id);
  // Include type on primary resource
  serialized.type = typeName;
  // Remove foreign keys from model
  for (var rel in toOneRels) {
    delete serialized[toOneRels[rel]];
  }
  serialized.links = link(model, {
    linkWithInclude: linkWithInclude,
    toManyWithoutInclude: toManyWithoutInclude,
    toOneWithoutInclude: toOneWithoutInclude,
    exporter: exporter
  });
  return serialized;
};
