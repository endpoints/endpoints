import _ from 'lodash';
import Kapow from 'kapow';

export default function(request, endpoint) {
  var err;
  var data = request.body.data;

  function hasToManyLinkage(object) {
    var has = false;
    _.forIn(object.links, function(val, key) {
      if (Array.isArray(val.linkage)) {
        has = true;
      }
    });
    return has;
  }

  // relation mode, to-Many relations appear as an array
  // TODO: this is a bad heuristic that needs to be changed
  if (request.params.relation) {
    err = Array.isArray(data);
  } else if (Array.isArray(data)) {
    err = _.reduce(data, function(result, resource) {
      return result || hasToManyLinkage(resource);
    }, false);
  } else {
    err = hasToManyLinkage(data);
  }

  return err ? Kapow(403, 'Full replacement of to-Many relations is not allowed.') : null;
}
