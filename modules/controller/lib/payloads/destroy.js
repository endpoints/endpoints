const errorPayload = require('./error_payload');

module.exports = function (errs, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (errs) {
    return errorPayload(errs, 400);
  }

  return {
    code: '204',
    data: null
  };
};
