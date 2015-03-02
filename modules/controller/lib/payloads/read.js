const Kapow = require('kapow');

const jsonApi = require('../../../formatter-jsonapi');
const errorPayload = require('./error_payload');

module.exports = function (errs, data, opts) {
  if (!opts) {
    opts = {};
  }
  var isRaw = !!opts.raw;
  var singleResult = !!opts.one;

  if (errs) {
    return errorPayload(errs, 400);
  }

  if (!data || singleResult && data.length === 0) {
    return errorPayload(Kapow(404, 'Resource not found.'));
  }

  if (isRaw) {
    return {
      code: '200',
      data: data
    };
  }

  return {
    code: '200',
    data: jsonApi(data, {
      singleResult: singleResult,
      relations: data.sourceOpts.include,
      typeName: opts.typeName
    })
  };
};
