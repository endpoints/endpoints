module.exports = function linkToOne (model, relations) {
  if (!model) {
    throw new Error('No model specified.');
  }
  if (!Array.isArray(relations)) {
    throw new Error('No relations to link specified.');
  }
  return relations.reduce(function (result, relationName) {
    var id, link;
    var isNestedRelation = relationName.indexOf('.') !== -1;
    var relation = model.related(relationName);
    if (isNestedRelation) {
      return result;
    }
    if (!relation) {
      throw new Error('Relation ' + relationName + ' is not defined on ' + model.tableName);
    }
    var relatedData = relation.relatedData;
    var resourceType = relatedData.target.typeName;
    if (relatedData.type === 'belongsTo') {
      id = model.get(relatedData.foreignKey);
      link = result[relationName] = {
        type: resourceType,
        id: id
      };
      if (id) {
        link.href = '/' + resourceType + '/' + id;
      }
    }
    return result;
  }, {});
};
