const bPromise = require('bluebird');
const Kapow = require('kapow');
const sanitizeRequestData = require('./sanitize_request_data');

module.exports = function(model, params) {
  if (!params) {
    return bPromise.resolve({});
  }

  var relations = params.links;
  var toManyRels = [];

  if (relations) {
    return bPromise.reduce(Object.keys(relations), function(result, key) {
      if (!model.related(key)) {
        throw Kapow(404, 'Unable to find relation "' + key + '"');
      }

      var fkey;
      var relation = relations[key];
      var relatedData = model.related(key).relatedData;
      var relationType = relatedData.type;

      // toOne relations
      if (relationType === 'belongsTo' || relationType === 'hasOne') {
        fkey = relatedData.foreignKey;

        return relatedData.target.collection().query(function(qb) {
          if (relation === null) {
            return qb;
          }
          return qb.where({id:relation.id});
        }).fetchOne().then(function(model) {
          if (model === null) {
            throw Kapow(404, 'Unable to find relation "' + key + '" with id ' + relation.id);
          }
          params[fkey] = relation === null ? relation : relation.id;
          return params;
        });
      }

      // toMany relations
      if (relationType === 'belongsToMany' || relationType === 'hasMany') {
        return bPromise.map(relations[key].id, function(id) {
          return relatedData.target.collection().query(function(qb) {
            return qb.where({id:id});
          }).fetchOne().then(function(model) {
            if (model === null) {
              throw Kapow(404, 'Unable to find relation "' + key + '" with id ' + id);
            }
            return params;
          });
        }).then(function() {
          toManyRels.push({
            name: key,
            id: relations[key].id
          });
          return params;
        });
      }
    }, params).then(function(params) {
      return {
        data: sanitizeRequestData(params),
        toManyRels: toManyRels
      };
    });
  }

  return bPromise.resolve({
    data: sanitizeRequestData(params),
    toManyRels: toManyRels
  });

};
