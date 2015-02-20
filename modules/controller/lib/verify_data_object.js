const _ = require('lodash');

module.exports = function(request, endpointType) {
  var err, type;

  if (!_.isPlainObject(request.body.data)) {
    err = new Error('Primary data must be a single object.');
    err.httpStatus = 400;
    err.title = 'Bad Request';
    return err;
  }

  type = request.body.data.type;

  if (typeof type !== 'string') {
    err = new Error('Primary data must include a type.');
    err.httpStatus = 400;
    err.title = 'Bad Request';
    return err;
  }

  if (type !== endpointType) {
    err = new Error('Data type does not match endpoint type.');
    err.httpStatus = 409;
    err.title = 'Conflict';
    return err;
  }
};
