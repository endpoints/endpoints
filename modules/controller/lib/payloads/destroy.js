module.exports = function (err, data, opts) {
  if (!opts) {
    opts = {};
  }
  console.log(err);

  if (err) {
    err.httpStatus = err.httpStatus || 400;

    return {
      code: String(err.httpStatus),
      data: {
        errors: {
          title: err.title || 'Bad Controller Destroy',
          detail: err.message
        }
      }
    };
  }

  return {
    code: '204',
    data: null
  };
};
