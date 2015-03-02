const jsonApi = require('../../../formatter-jsonapi');
const errorPayload = require('./error_payload');

module.exports = function (errs, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (errs) {
    return errorPayload(errs, 422);
  }

  opts.singleResult = true;

  return {
    code: '201',
    data: jsonApi(data, opts),
    headers: {
      location: '/' + opts.typeName + '/' + data.id
    }
  };
};
