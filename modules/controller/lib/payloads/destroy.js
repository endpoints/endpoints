module.exports = function (err, data, opts) {
  if (!opts) {
    opts = {};
  }

  if (err) {
    return {
      code: 400,
      data: {
        errors: {
          title: 'Bad Controller Destroy',
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
