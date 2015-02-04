// Given a Bookshelf model or collection, return all
// related models for the requested relationName.
function getRelated (relationName, input) {
  var result, type;
  if (Array.isArray(input) || Array.isArray(input.models)) {
    result = input.map(getRelated.bind(null, relationName)).
      reduce(function (result, node) { return result.concat(node); }, []);
  } else {
    result = input.related(relationName);
    type = result.relatedData.target.typeName;
  }
  result.type = type;
  return result;
}

// Take a Bookshelf model or collection + a single relation
// string and iterate through it, returning the models in
// the last relation only.
module.exports = function relate (model, relation) {
  // Bookshelf relations can be requested arbitarily deep as
  // dot notated strings. Here, we traverse the relation until
  // we reach the final node. The models in this node are then
  // returned.
  var relationSegments = relation.split('.');
  return relationSegments.reduce(function (source, segment) {
    return getRelated(segment, source);
  }, model);
};
