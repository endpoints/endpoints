'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

exports['default'] = function (errs, defaultErr) {
  var resp;

  defaultErr = defaultErr || 400;
  errs = errs || [_Kapow2['default'](defaultErr)];

  if (!Array.isArray(errs)) {
    errs = [errs];
  }

  resp = _import2['default'].transform(errs, function (result, err) {
    if (!err.httpStatus) {
      err = _Kapow2['default'].wrap(err, defaultErr);
    }

    var httpStatus = err.httpStatus;

    result.code[httpStatus] = result.code[httpStatus] ? result.code[httpStatus] + 1 : 1;

    result.data.errors.push({
      title: err.title,
      detail: err.message
    });
  }, {
    code: {},
    data: {
      errors: []
    }
  });

  resp.code = _import2['default'].reduce(resp.code, function (result, n, key) {
    if (!result || n > resp.code[result]) {
      return key;
    }
    return result;
  }, '');

  return resp;
};

module.exports = exports['default'];