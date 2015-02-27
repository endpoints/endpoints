const _ = require('lodash');
const Kapow = require('kapow');

module.exports = function(request, endpoint) {
  var err, type, id;
  var data = request.body.data;

  if (!_.isPlainObject(data)) {
    err = Kapow(400, 'Primary data must be a single object.');
    return err;
  }

  type = data.type;
  id = data.id;

  if (typeof type !== 'string') {
    err = Kapow(400, 'Primary data must include a type.');
    return err;
  }

  if (type !== endpoint.type) {
    err = Kapow(409, 'Data type does not match endpoint type.');
    return err;
  }

  if (id && endpoint.id && id !== endpoint.id) {
    err = Kapow(409, 'Data id does not match endpoint id.');
    return err;
  }
};
