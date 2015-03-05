module.exports = function getNestedRelations(model, rel) {
  var relatedModels;

  if (model.models) {
    relatedModels = model.models.reduce(function(collection, model) {
      return collection.add(model.related(rel.shift()));
    });
  } else {
    relatedModels = model.related(rel.shift());
  }

  if (rel.length === 0) {
    return relatedModels;
  } else {
    return getNestedRelations(relatedModels, rel);
  }
};
