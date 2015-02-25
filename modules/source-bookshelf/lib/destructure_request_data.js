const sanitizeRequestData = require('./sanitize_request_data');

module.exports = function(model, params) {
  if (!params) {
    return {};
  }

  var relations = params.links;
  var toManyRels = [];

  if (relations) {
    params = Object.keys(relations).reduce(function(result, key) {
      if (!model.related(key)) {
        // TODO: pull all error responses into a single lib
        var err = new Error('Unable to update relationships');
        err.httpStatus = 403;
        err.title = 'Forbidden';
        throw err;
      }

      var fkey;
      var relation = relations[key];
      var relationType = model.related(key).relatedData.type;

      // toOne relations
      if (relationType === 'belongsTo' || relationType === 'hasOne') {
        fkey = model.related(key).relatedData.foreignKey;
        params[fkey] = relation.id;
      }

      // toMany relations
      if (relationType === 'belongsToMany' || relationType === 'hasMany') {
        toManyRels.push({
          name: key,
          ids: relations[key].ids
        });
      }

      return params;
    }, params);
  }

  return {
    data: sanitizeRequestData(params),
    toManyRels: toManyRels
  };
};
