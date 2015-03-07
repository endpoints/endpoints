const throwIfNoModel = require('../throw_if_no_model');
const getParams = require('../get_params');

module.exports = function(source, opts, request) {
  var relation = request.params.relation || null;
  var params = getParams(request, opts);
  var findRelated;
  if (relation) {
    findRelated = source.related.bind(source, params, relation);
    return source.byId(request.params.id, relation).
      then(throwIfNoModel).
      then(findRelated);
  }

  var idParam = request.params && request.params.id;
  if (idParam) {
    // FIXME: this could collide with filter[id]=#
    params.filter.id = idParam;
  }
  return source.read(params);
};
