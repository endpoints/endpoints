const jsonApi = require('../../../formatter-jsonapi');

module.exports = function (err, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (err) {
    err.httpStatus = err.httpStatus || 422;

    return {
      code: String(err.httpStatus),
      data: {
        errors: {
          title: err.title || 'Unprocessable Entity',
          detail: err.message
        }
      }
    };
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
