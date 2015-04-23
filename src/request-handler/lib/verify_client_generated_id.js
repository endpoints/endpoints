import _ from 'lodash';
import Kapow from 'kapow';

export default function(request) {
  var err;
  var data = request.body.data;

  if (Array.isArray(data)) {
    err = _.some(data, 'id');
  } else {
    err = !!data.id;
  }

  return err  ? Kapow(403, 'Client generated IDs are not enabled.') : null;
}
