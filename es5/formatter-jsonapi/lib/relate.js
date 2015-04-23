'use strict';

exports.__esModule = true;
// Given a Bookshelf model or collection, return a related
// collection or model.
function getRelated(relationName, input) {
  var collection;
  if (input.models) {
    // this is fully ridiculous. when looking for the related thing from
    // a collection of models, i need a single collection to put them in
    // and this is the only way to make one.
    collection = input.model.forge().related(relationName).relatedData.target.collection();
    // now that i have a collection for the relation we're retreiving,
    // iterate each model and add its related models to the collection
    return input.reduce(function (result, model) {
      var related = model.related(relationName);
      return result.add(related.models ? related.models : related);
    }, collection);
  }

  return input.related(relationName);
}

// Take a Bookshelf model or collection + dot-notated relation
// string and iterate through it, returning the model(s) in the
// last relation only.

exports['default'] = function (model, relation) {
  // Bookshelf relations can be requested arbitarily deep as
  // dot notated strings. Here, we traverse the relation until
  // we reach the final node. The models in this node are then
  // returned.
  var relationSegments = relation.split('.');
  return relationSegments.reduce(function (source, segment) {
    return getRelated(segment, source);
  }, model);
};

module.exports = exports['default'];