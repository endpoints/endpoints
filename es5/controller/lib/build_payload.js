'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var TYPE = 'application/vnd.api+json';

module.exports = function (validate, process, format, error, request) {
  var errors = validate(request);
  return _bluebird2['default'][errors ? 'reject' : 'resolve'](errors).then(function () {
    return process(request);
  }).then(format)['catch'](error).tap(function (payload) {
    if (!payload.headers) {
      payload.headers = {};
    }
    payload.headers['content-type'] = TYPE;
  });
};