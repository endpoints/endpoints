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

}

export default Resource;
