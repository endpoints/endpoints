const jsonApi = require('../../../formatter-jsonapi');
const errorPayload = require('./error_payload');

module.exports = function (errs, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (errs) {
    return errorPayload(errs, 422);
  }

  return {
    code: '200',
    data: jsonApi(data, opts)
  };
};
