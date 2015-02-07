const jsonApi = require('../../../formatter-jsonapi');

module.exports = function (err, data, opts) {
  if (!opts) {
    opts = {};
  }
  var isRaw = !!opts.raw;
  var singleResult = !!opts.one;
  var relations = opts.relations;

  if (err) {
    return {
      code: 400,
      data: {
        errors: {
          title: 'Bad Controller Read',
          detail: err.message
        }
      }
    };
  }

  if (!data || singleResult && data.length === 0) {
    return {
      code: 404,
      data: {
        errors: {
          title: 'Not Found',
          detail: 'Resource not found.'
        }
      }
    };
  }

  if (isRaw) {
    return {
      code: 200,
      data: data
    };
  }

  return {
    code: 200,
    data: jsonApi(data, {
      one: singleResult,
      relations: relations
    })
  };
};
