// Given a Bookshelf model or collection, return all
// related models for the requested relationName.
module.exports = function getRelated (relationName, input) {
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
};
