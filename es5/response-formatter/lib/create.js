'use strict';

exports.__esModule = true;

exports['default'] = function (formatter, config, data) {
  return {
    code: '201',
    data: formatter(data, {
      singleResult: true
    }),
    headers: {
      location: '/' + config.typeName + '/' + data.id
    }
  };
};

module.exports = exports['default'];