const throwIfNoModel = require('../throw_if_no_model');
const getNestedRelations = require('../get_nested_relations');

module.exports = function(source, opts, request) {
  var relation = request.params.relation || null;
  return source.byId(request.params.id, relation).
    then(throwIfNoModel).
    then(function (model) {
      var result = getNestedRelations(model, relation.split('.'));

      // opts.typeName at the moment is the source type NOT the related type.
      if (result.length) {
        opts.typeName = result.models[0].constructor.typeName;
      } else {
        opts.typeName = result.constructor.typeName;
      }

      result.sourceOpts = opts;
      return result;
    });
};
