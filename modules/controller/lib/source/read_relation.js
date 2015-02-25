const throwIfNoModel = require('../throw_if_no_model');

module.exports = function(source, opts, request) {
  var relation = request.params.relation || null;
  return source.byId(request.params.id, relation).
    then(throwIfNoModel).
    then(function (model) {
      return model.related(relation);
    });
};
