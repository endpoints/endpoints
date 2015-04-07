'use strict';

module.exports = function (formatter, config, data) {
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