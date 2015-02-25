const _ = require('lodash');

module.exports = function(request, endpoint) {
  var err, type, id;
  var data = request.body.data;

  if (!_.isPlainObject(data)) {
    err = new Error('Primary data must be a single object.');
    err.httpStatus = 400;
    err.title = 'Bad Request';
    return err;
  }

  type = data.type;
  id = data.id;

  if (typeof type !== 'string') {
    err = new Error('Primary data must include a type.');
    err.httpStatus = 400;
    err.title = 'Bad Request';
    return err;
  }

  if (type !== endpoint.type) {
    err = new Error('Data type does not match endpoint type.');
    err.httpStatus = 409;
    err.title = 'Conflict';
    return err;
  }

  if (id && endpoint.id && id !== endpoint.id) {
    err = new Error('Data id does not match endpoint id.');
    err.httpStatus = 409;
    err.title = 'Conflict';
    return err;
  }
};
