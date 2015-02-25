module.exports = function(model) {
  if (!model) {
    var err = new Error('Unable to locate model.');
    err.httpStatus = 404;
    err.title = 'Not found';
    throw err;
  }

  // Bookshelf throws an error for any number of unrelated reasons.
  // json-api requires we throw specific errors for certain situations.
  if (model instanceof Error) {
    if (
      /No rows were affected/.test(model.message) ||
      /Unable to locate model/.test(model.message)
    ) {
      model.httpStatus = 404;
      model.title = 'Not found';
    } else {
      model.httpStatus = 500;
      model.title = 'Server Error';
    }
    throw model;
  }

  return model;
};
