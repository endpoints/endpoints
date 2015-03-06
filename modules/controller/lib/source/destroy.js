module.exports = function(source, opts, request) {
  var method = opts.method;
  return source.byId(request.params.id).
    then(function (model) {
      if (model) {
        return source.destroy(model, method);
      }
    });
};
