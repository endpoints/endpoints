const _ = require('lodash');

const toOneRelations = require('./to_one_relations');
const getKey = require('./get_key');
const link = require('./link');

module.exports = function formatModel(output, model, opts) {
  // determine which to-one relations on this model were not
  // explicitly included.
  var allRelations = model.constructor.relations;
  var toOneRels = toOneRelations(model, allRelations);
  // get the or initialize the primary resource key
  var primaryResource = getKey(output, 'data');
  // get a json representation of the model, excluding any related data
  var serialized = model.toJSON({shallow:true});
  // get the relations we'll be pulling off the input data
  var linkWithInclude = opts.relations || [];
  var linkWithoutInclude = _.difference(Object.keys(toOneRels), linkWithInclude);
  // get the underlying model type so we know what the primary resource is
  var typeName = opts.typeName;
  // build a links object, adding any linked models to
  var links = link(model, {
    linkWithInclude: linkWithInclude,
    linkWithoutInclude: linkWithoutInclude,
    exporter: function (models, type) {
      var shallowModel;
      // get a reference to the array of linked resources of this type
      var linkedResource = getKey(output.linked, type);
      // get the index of ids for this resource type
      var index = getKey({}, type);
      // iterate each of the linked resources
      models.forEach(function (model) {
        // cache the model's ID
        var id = model.id;
        // only add the linked resource if it doesn't already exist.
        if (id && index.indexOf(id) === -1) {
          shallowModel = model.toJSON({shallow:true});
          // json-api requires id be a string -- shouldn't rely on server
          shallowModel.id = String(shallowModel.id);
          // Include type on linked resources
          shallowModel.type = model.typeName;
          linkedResource.push(model.toJSON({shallow:true}));
          index.push(id);
        }
      });
    }
  });

  // json-api requires id be a string -- shouldn't rely on server
  serialized.id = String(serialized.id);
  // Include type on primary resource
  serialized.type = typeName;

  // Remove foreign keys from model
  for (var rel in toOneRels) {
    delete serialized[toOneRels[rel]];
  }

  // always add a self-referential link
  links.self = '/' + typeName + '/' + model.id;
  serialized.links = links;

  // add the model to the primary resource key
  primaryResource.push(serialized);
  // return the output we have built up so far
  return output;
};
