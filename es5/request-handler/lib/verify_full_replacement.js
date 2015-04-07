'use strict';

var _ = require('lodash');
var Kapow = require('kapow');

module.exports = function (request, endpoint) {
  var err;
  var data = request.body.data;
  var mode = endpoint.mode(request);

  function hasToManyLinkage(object) {
    var has = false;
    _.forIn(object.links, function (val, key) {
      if (Array.isArray(val.linkage)) {
        has = true;
      }
    });
    return has;
  }

  // relation mode, to-Many relations appear as an array
  if (mode === 'relation') {
    err = Array.isArray(data);
  } else if (Array.isArray(data)) {
    err = _.reduce(data, function (result, resource) {
      return result || hasToManyLinkage(resource);
    }, false);
  } else {
    err = hasToManyLinkage(data);
  }

  return err ? Kapow(403, 'Full replacement of to-Many relations is not allowed.') : null;
};