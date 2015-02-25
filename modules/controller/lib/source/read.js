const getParams = require('../get_params');

module.exports = function(source, opts, request) {
  return source.read(getParams(request, opts));
};
