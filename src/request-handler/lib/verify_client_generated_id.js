const _ = require('lodash');
const Kapow = require('kapow');

module.exports = function(request) {
  var err;
  var data = request.body.data;

  if (Array.isArray(data)) {
    err = _.some(data, 'id');
  } else {
    err = !!data.id;
  }

  return err  ? Kapow(403, 'Client generated IDs are not enabled.') : null;
};
