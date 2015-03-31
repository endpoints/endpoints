module.exports = function (model, relations) {
  if (!Array.isArray(relations)) {
    return {};
  }
  return relations.reduce(function (result, relationName) {
    // nested relations are specified by dot notated strings
    // if a relation has a dot in it, it is nested, and therefor
    // cannot be a toOne relation. ignore it.
    if (relationName.indexOf('.') !== -1) {
      return result;
    }
    // find related information about the model
    var relation = model.related(relationName);
    var relKey = relation.relatedData.foreignKey;
    // if a relation is specified on the model that doesn't
    // actually exist, we should bail out quickly.
    if (!relation) {
      throw new Error(
        'Relation ' + relationName + ' is not defined on ' + model.tableName
      );
    }
    // is this relation of a kind we care about? if yes, add it!
    if (relation.relatedData.type === 'belongsTo') {
      result[relationName] = relKey;
    }
    return result;
  }, {});
};
