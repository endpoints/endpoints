import createFromFS from './lib/create_from_fs';

class Resource {

  constructor(opts={}, searchPaths=[]) {
    if (typeof opts === 'string' && Array.isArray(searchPaths)) {
      opts = createFromFS(opts, searchPaths);
    }
    if (!opts.name) {
      throw new Error('Resource must have a name.');
    }
    if (!opts.routes) {
      throw new Error('Resource must have routes.');
    }
    this.name = opts.name;
    this.routes = opts.routes;
    this.controller = opts.controller;
  }

  get type () {
    if (!this.controller) {
      return this.name;
    }
    const {store, model} = this.controller;
    return store.type(model);
  }

  

  get capabilities() {
    const {store, model} = this.config;
    // TODO: include this.config?
    return {
      filters: Object.keys(store.filters(model)),
      includes: store.allRelations(model),
    };
  }
}

export default Resource;
