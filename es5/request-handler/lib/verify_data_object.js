'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

exports['default'] = function (request, endpoint) {
  var err, isValidType, id;
  var data = request.body.data;

  if (!_lodash2['default'].isPlainObject(data) && !_lodash2['default'].isArray(data)) {
    err = _kapow2['default'](400, 'Primary data must be a single object or array.');
    return err;
  }

  if (_lodash2['default'].isArray(data)) {
    isValidType = _lodash2['default'].reduce(data, function (isValid, resource) {
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
    err = _kapow2['default'](400, 'Primary data must include a type.');
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

module.exports = exports['default'];