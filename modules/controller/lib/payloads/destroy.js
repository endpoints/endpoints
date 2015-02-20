module.exports = function (err, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (err) {
    return {
      code: err.httpStatus || 400,
      data: {
        errors: {
          title: err.title || 'Bad Controller Destroy',
          detail: err.message
        }
      }
    };
  }

  return {
    code: 204,
    data: null
  };
};
