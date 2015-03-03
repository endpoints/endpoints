const jsonApi = require('../../../formatter-jsonapi');
const errorPayload = require('./error_payload');

module.exports = function (errs, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (errs) {
    console.log(errs);
    return errorPayload(errs, 422);
  }

  if (data) {
    return {
      code: '200',
      data: jsonApi(data, opts)
    };
  }

  return {
    code: '204',
    data: null
  };
};
