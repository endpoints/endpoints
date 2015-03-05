const throwIfNoModel = require('../throw_if_no_model');

module.exports = function(source, opts, request) {
  var relation = request.params.relation || null;
  return source.byId(request.params.id, relation).
    then(throwIfNoModel).
    then(function (model) {
      var result = model.related(relation);
      if (result.length) {
        // opts.typeName at the moment is the sourceType NOT the related type.
        opts.typeName = result.models[0].constructor.typeName;
      } else {
        opts.typeName = result.constructor.typeName;
      }
      result.sourceOpts = opts;
      return result;
    });
};
