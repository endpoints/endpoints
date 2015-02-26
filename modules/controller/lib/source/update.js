const throwIfNoModel = require('../throw_if_no_model');

module.exports = function(source, opts, request) {
  var method = opts.method;
  return source.byId(request.params.id).
    then(throwIfNoModel).
    then(function (model) {
      return source.update(model, method, request.body.data);
    });
};
