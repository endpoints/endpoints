const Kapow = require('kapow');

const jsonApi = require('../../../formatter-jsonapi');
const errorPayload = require('./error_payload');

module.exports = function (errs, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (errs) {
    return errorPayload(errs, 400);
  }

  if (!data || data.length === 0 && data.singleResult) {
    return errorPayload(Kapow(404, 'Resource not found.'));
  }

  return {
    code: '200',
    data: jsonApi(data, {
      singleResult: data.singleResult,
      relations: data.relations
    })
  };
};
