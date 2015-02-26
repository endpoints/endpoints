module.exports = function(model) {
  if (model) {
    var err = new Error('Model with this ID already exists');
    err.httpStatus = 409;
    err.title = 'Conflict';
    throw err;
  }
  return model;
};
