const jsonApi = require('../../../formatter-jsonapi');

module.exports = function (err, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (err) {
    return {
      code: err.httpStatus || 422,
      data: {
        errors: {
          title: err.title || 'Unprocessable Entity',
          detail: err.message
        }
      }
    };
  }

  return {
    code: 201,
    data: jsonApi(data, {
      typeName: opts.type
    })
  };
};
