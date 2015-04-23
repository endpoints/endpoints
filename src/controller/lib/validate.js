import _ from 'lodash';

import adapterHas from './adapter_has';

export default function (method, config, adapter) {
  return _.compose(_.flatten, _.compact)([
    adapterHas(adapter.relations(), config.include, 'relations'),
    adapterHas(adapter.filters(), Object.keys(config.filter), 'filters'),
    // this is crap
    (method === 'read') ? null :
      adapterHas(
        method === 'create' ? adapter.model : adapter.model.prototype,
        config.method,
        'method'
      )
  ]);
}
