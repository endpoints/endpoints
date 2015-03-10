const Kapow = require('kapow');

const error = require('./error');

module.exports = function (formatter, config, data) {

  if (!data || data.length === 0 && data.singleResult) {
    return error(Kapow(404, 'Resource not found.'));
  }

  return {
    code: '200',
    data: formatter(data, {
      singleResult: data.singleResult,
      relations: data.relations,
      typeName: config.typeName
    })
  };
};
