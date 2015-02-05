module.exports = function (err, data, type) {
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

  if (!data) {
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

  return {
    code: 200,
    data: data
  };
};
