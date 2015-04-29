'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireDefault(_Kapow);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

exports['default'] = function (formatter, config, data) {
  if ((!data || data.length === 0 && data.singleResult) && data.mode !== 'related') {
    return _error2['default'](_Kapow2['default'](404, 'Resource not found.'));
  }

  return {
    code: '200',
    data: formatter(data, {
      singleResult: data.singleResult,
      relations: data.relations,
      mode: data.mode,
      baseType: data.baseType,
      baseId: data.baseId,
      baseRelation: data.baseRelation
    })
  };
};

module.exports = exports['default'];