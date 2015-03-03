const Kapow = require('kapow');
const throwIfNoModel = require('../throw_if_no_model');

module.exports = function(source, opts, request) {
  var method = opts.method;
  return source.byId(request.params.id).
    then(throwIfNoModel).
    then(function (model) {
      return source.update(model, method, request.body.data);
    }).catch(function(e) {
      // This may only work for SQLITE3, but tries to be general
      if (e.message.toLowerCase().indexOf('null') !== -1) {
        Kapow.wrap(e, 409);
      }
      throw e;
    });
};
