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
  id = request.params && request.params.id;

  if (typeof type !== 'string') {
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
};
