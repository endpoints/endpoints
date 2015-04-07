'use strict';

module.exports = function (formatter, config, data) {
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