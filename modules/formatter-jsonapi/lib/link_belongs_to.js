module.exports = function linkBelongsTo (model) {
  return model.constructor.relations.reduce(function (result, relationName) {
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
