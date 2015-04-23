'use strict';

exports.__esModule = true;

exports['default'] = function (formatter, config, data) {
  if (data && !config.relationOnly) {
    return {
      code: '200',
      data: formatter(data, config)
    };
  }
  return {
    code: '204',
    data: null
  };
};

module.exports = exports['default'];