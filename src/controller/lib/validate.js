import _ from 'lodash';

import modelHas from './model_has';

module.exports = function (method, config) {
  const {model, store} = config;
  return _.compose(_.flatten, _.compact)([
    modelHas(store.allRelations(model), config.include, 'relations'),
    modelHas(Object.keys(store.filters(model)), Object.keys(config.filter), 'filters')
/*
    // this is crap
    (method === 'read') ? null :
      modelHas(
        method === 'create' ? model : model.prototype,
        config.method,
        'method'
      )
*/
  ]);
};
