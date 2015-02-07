module.exports = function (err, data, opts) {
  if (!opts) {
    opts = {};
  }
  var type = opts.type;

  if (err) {
    return {
      code: 422,
      data: {
        errors: {
          title: 'Unprocessable Entity',
          detail: err.message
        }
      }
    };
  }

  // scope result to type for json-api compliance
  var result = {};
  result[type] = data;

  return {
    code: 201,
    data: result
  };
};
