const throwIfModel = require('../throw_if_model');

module.exports = function(source, opts, request) {
  var method = opts.method;
  var data = request.body.data;
  if (data && data.id) {
    return source.byId(data.id)
      .then(throwIfModel)
      .then(function() {
        return source.create(method, request.body.data);
      }
    );
  } else {
    return source.create(method, request.body.data);
  }
};
