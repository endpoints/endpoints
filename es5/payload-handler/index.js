'use strict';

exports.__esModule = true;

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireDefault(_Kapow);

var PayloadHandler = (function () {
  function PayloadHandler(formatter) {
    _classCallCheck(this, PayloadHandler);

    this.formatter = formatter;
  }

  PayloadHandler.prototype.create = function create(config, data) {
    return {
      code: '201',
      data: this.formatter.process(data, {
        singleResult: true
      }),
      headers: {
        location: this.formatter.selfUrl(data)
      }
    };
  };

  PayloadHandler.prototype.read = function read(config, data) {
    if ((!data || data.length === 0 && data.singleResult) && data.mode !== 'related') {
      return this.error(_Kapow2['default'](404, 'Resource not found.'));
    }

    return {
      code: '200',
      data: this.formatter.process(data, {
        singleResult: data.singleResult,
        relations: data.relations,
        mode: data.mode,
        baseType: data.baseType,
        baseId: data.baseId,
        baseRelation: data.baseRelation
      })
    };
  };

  PayloadHandler.prototype.readRelated = function readRelated(config, data) {
    return this.read(config, data);
  };

  PayloadHandler.prototype.readRelation = function readRelation(config, data) {
    return this.read(config, data);
  };

  PayloadHandler.prototype.update = function update(config, data) {
    if (data && !config.relationOnly) {
      return {
        code: '200',
        data: this.formatter.process(data, config)
      };
    }
    return {
      code: '204',
      data: null
    };
  };

  PayloadHandler.prototype.destroy = function destroy() {
    return {
      code: '204',
      data: null
    };
  };

  PayloadHandler.prototype.error = function error(errs, defaultErr) {
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

  return PayloadHandler;
})();

exports['default'] = PayloadHandler;
module.exports = exports['default'];