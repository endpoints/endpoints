module.exports = function (err, data, type) {
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
    code: 200,
    data: result
  };
};
