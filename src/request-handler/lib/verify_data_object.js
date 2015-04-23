import _ from 'lodash';
import Kapow from 'kapow';

export default function(request, endpoint) {
  var err, isValidType, id;
  var data = request.body.data;

  if (!_.isPlainObject(data) && !_.isArray(data)) {
    err = Kapow(400, 'Primary data must be a single object or array.');
    return err;
  }

  if (_.isArray(data)) {
    isValidType = _.reduce(data, function(isValid, resource) {
      if (!resource.type || typeof resource.type !== 'string') {
        isValid = false;
      }
      return isValid;
    }, true);
  } else {
    isValidType = typeof data.type === 'string';
  }

  id = request.params && request.params.id;

  if (!isValidType) {
    err = Kapow(400, 'Primary data must include a type.');
    return err;
  }

/*
  // TODO: fix this. at the moment, if you try to do something like
  // PATCH /books/1/author, the target type of that request is 'books'
  // when it should actually be 'authors' this disables type checking
  // for write operations until this can be resolved.
  if (!writeRelation && type !== endpoint.typeName) {
    err = Kapow(409, 'Data type does not match endpoint type.');
    return err;
  }

  // TODO: fix this. at the moment, if you try to do something like
  // PATCH /books/1/author, the target id of that request doesn't match
  // the actual resource being targetted.
  if (id && data.id && id !== data.id) {
    err = Kapow(409, 'Data id does not match endpoint id.');
    return err;
  }

  */
}
