const relate = require('./relate');

// Take a Bookshelf model and an array of relations and return
// a json-api compliant "links" object. Also supports a callback
// function to recieve the related resources as they are passed
// over.
module.exports = function link (model, relations, exporter) {
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
};
