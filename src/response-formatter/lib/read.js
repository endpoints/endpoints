const Kapow = require('kapow');
const error = require('./error');

module.exports = function (formatter, config, data) {

  // @todo handle relations correctly
  // GET /book/11/series should not throw resource not found
  // it should show it as null
  if (!data || data.length === 0 && data.singleResult) {
    return error(Kapow(404, 'Resource not found.'));
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
