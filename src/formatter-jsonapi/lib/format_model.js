import _ from 'lodash';

import toOneRelations from './to_one_relations';
import link from './link';

export default function (opts, model) {
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
  var toOneRels = toOneRelations(model, allRelations);
  // get the list of relations we have not included
  var linkWithoutInclude = _.difference(allRelations, linkWithInclude);
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
  if (mode === 'relation') {
    topLevelLinks = link(model, opts);
  } else {
    serialized.links = link(model, {
      linkWithInclude: linkWithInclude,
      linkWithoutInclude: linkWithoutInclude,
      exporter: exporter
    });
  }
  return serialized;
}
