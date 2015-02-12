const _ = require('lodash');

const getKey = require('./lib/get_key');
const toOneRelations = require('./lib/to_one_relations');
const link = require('./lib/link');

// Take an array of Bookshelf models and convert them into a
// json-api compliant representation of the underlying data.
module.exports = function (input, opts) {
  // get the relations we'll be pulling off the input data
  var linkWithInclude = opts.relations || [];
  // cache if we are looking for a single item
  var singleResult = opts.one;
  // initialize an index so we can prevent serializing the same records
  // more than once to the top level `linked` key.
  var linkedResourceIndex = {};
  // get the underlying model type so we know what the primary resource is
  var typeName = opts.typeName;
  // iterate through the input, adding links and populating linked data
  var result = input.reduce(function (output, model) {
    // determine which to-one relations on this model were not
    // explicitly included.
    var allRelations = model.constructor.relations;
    var toOneRels = toOneRelations(model, allRelations);
    var linkWithoutInclude = _.difference(Object.keys(toOneRels), linkWithInclude);
    // get the or initialize the primary resource key
    var primaryResource = getKey(output, 'data');
    // get a json representation of the model, excluding any related data
    var serialized = model.toJSON({shallow:true});
    // build a links object, adding any linked models to
    var links = link(model, {
      linkWithInclude: linkWithInclude,
      linkWithoutInclude: linkWithoutInclude,
      exporter: function (models, type) {
        var shallowModel;
        // get a reference to the array of linked resources of this type
        var linkedResource = getKey(output.linked, type);
        // get the index of ids for this resource type
        var index = getKey(linkedResourceIndex, type);
        // iterate each of the linked resources
        models.forEach(function (model) {
          // cache the model's ID
          var id = model.get('id');
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

    if (Object.keys(links).length > 0) {
      serialized.links = links;
    }
    // add the model to the primary resource key
    primaryResource.push(serialized);
    // return the output we have built up so far
    return output;
  }, {linked:{}});

  // if there is no linked data, don't include it.
  if (Object.keys(result.linked).length === 0) {
    delete result.linked;
  }

  // if we were looking for a single result, return it as an object
  if (singleResult && input.length === 1) {
    result.data = result.data[0];
  }

  // if there is nothing in the root object, represent it as an empty array
  if (!result.data) {
    result.data = [];
  }

  // bam.  done.
  return result;
};
