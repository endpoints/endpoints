const extend = require('extend');

// Initialize a key on a provided object to an array.
function getKey (source, key) {
  if (!source[key]) {
    source[key] = [];
  }
  return source[key];
}

// Given a Bookshelf model or collection, return all
// related models for the requested relation.
function getRelated (relation, input) {
  var result, type;
  if (Array.isArray(input) || Array.isArray(input.models)) {
    result = input.map(getRelated.bind(null, relation)).
      reduce(function (result, node) { return result.concat(node); }, []);
  } else {
    result = input.related(relation);
    type = result.relatedData.target.typeName;
  }
  result.type = type;
  return result;
}

// Take a Bookshelf model or collection + a single relation
// string and iterate through it, returning the models in
// the last relation only.
function relate (model, relation) {
  // Bookshelf relations can be requested arbitarily deep as
  // dot notated strings. Here, we traverse the relation until
  // we reach the final node. The models in this node are then
  // returned.
  var relationSegments = relation.split('.');
  return relationSegments.reduce(function (source, segment) {
    return getRelated(segment, source);
  }, model);
}

// Take a Bookshelf model and an array of relations and return
// a json-api compliant "links" object. Also supports a callback
// function to recieve the related resources as they are passed
// over.
function link (model, relations, exporter) {
  // iterate relations, reducing to a json-api compatible links object.
  return relations.reduce(function (links, relation) {
    // traverse the dot-notated relation and return the relations
    // for the last item only. e.g. given a model `posts`, if one
    // of the requested relations was `comments.author`, the
    // relatedData here would be the author model for each comment
    // made on the post.
    var related = relate(model, relation);
    var type = related.type;
    // get a reference to the links key for this relation
    var link = links[relation] = {
      type: type
    };
    if (Array.isArray(related.models) || Array.isArray(related)) {
      // if the related is an array, we have a hasMany relation
      // and should serialize to an `ids` key rather than the `id`
      // key
      link.ids = related.reduce(function (result, model) {
        var id = model.get('id');
        // exclude nulls and duplicates, the point of a links
        // entry is to provide linkage to related resources,
        // not a full mapping of the underlying data
        if (id && result.indexOf(id) === -1) {
          result.push(id);
        }
        return result;
      }, []);
      // pass out the related data so it can be added to the top level
      // `linked` key in the response.
      exporter(related, type);
    } else {
      // for singular resources, store the id under `id`
      link.id = related.get('id')||null;
      // pass out the related data so it can be added to the top level
      // `linked` key in the response.
      exporter([related], type);
    }
    return links;
  }, {});
}

function linkBelongsTo (model) {
  return model.constructor.relations.reduce(function (result, relationName) {
    var relatedData = model.related(relationName).relatedData;
    var resourceType = relatedData.target.typeName;
    var id;
    if (relatedData.type === 'belongsTo') {
      id = model.get(relatedData.foreignKey);
      result[relationName] = {
        type: resourceType,
        id: id,
        href: '/'+resourceType+'/'+id
      }
    }
    return result;
  }, {});
}

// Take an array of Bookshelf models and convert them into a
// json-api compliant representation of the underlying data.
module.exports = function (input, opts) {
  // get the relations we'll be pulling off the input data
  var relations = opts.relations;
  // cache if we are looking for a single item
  var singleResult = opts.singleResult;
  // cache if we requested any relations
  var relationsRequested = !!relations.length;
  // initialize an index so we can prevent serializing the same records
  // more than once to the top level `linked` key.
  var linkedResourceIndex = {};
  // get the underlying model type so we know what the primary resource is
  var typeName = input.model.typeName;
  // iterate through the input, adding links and populating linked data
  var result = input.reduce(function (output, model) {
    var links;
    // get the or initialize the primary resource key
    var primaryResource = getKey(output, typeName);
    // get a json representation of the model, excluding any related data
    var serialized = model.toJSON({shallow:true});
    // initialize belongsTo links
    var links = linkBelongsTo(model);
    // only process links if we need to
    if (relationsRequested) {
      // add link data, calling an 'exporter' method each time a relation
      // is linked. this method allows us to push the linked resources into
      // the top level `linked` key.
      extend(links, link(model, relations, function (models, type) {
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
            linkedResource.push(model.toJSON({shallow:true}));
            index.push(id);
          }
        });
      }));
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
  if (singleResult) {
    result[typeName] = result[typeName][0];
  }

  // if there is nothing in the root object, represent it as an empty array
  if (!result[typeName]) {
    result[typeName] = [];
  }

  // bam.  done.
  return result;
};
